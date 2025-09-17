// server/controllers/OrderController.ts

import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
// Agora estamos a importar os models diretamente, sem a classe wrapper
import User from "../models/UserModel";
import Product from "../models/ProductModel";
import Coupon from "../models/CouponModel";
import Order from "../models/OrderModel";

class OrderController {
    static checkout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { cartItems, couponCode, shippingCost, shippingAddress } = req.body;

        if (!userId) {
            res.status(401).json({ error: "Utilizador não autenticado." });
            return;
        }
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            res.status(400).json({ error: "O carrinho de compras está vazio." });
            return;
        }
        if (!shippingAddress) {
            res.status(400).json({ error: "O endereço de entrega é obrigatório." });
            return;
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // CORREÇÃO: Usamos 'User' diretamente, que agora é o model do Mongoose
            const user = await User.findById(userId).session(session);
            if (!user) {
                throw new Error("Utilizador não encontrado.");
            }

            let subtotal = 0;
            for (const item of cartItems) {
                // CORREÇÃO: Usamos 'Product' diretamente
                const product = await Product.findById(item.productId).session(session);
                if (!product) throw new Error(`Produto "${item.name}" não encontrado.`);
                if (product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para "${item.name}". Disponível: ${product.stock}`);
                }
                subtotal += product.price * item.quantity;
            }

            let discountAmount = 0;
            if (couponCode) {
                // CORREÇÃO: Usamos 'Coupon' diretamente
                const coupon = await Coupon.findOne({ code: couponCode }).session(session);
                if (!coupon || !coupon.isActive || new Date(coupon.expirationDate) < new Date()) {
                    throw new Error("Cupom inválido ou expirado.");
                }
                if (coupon.code === 'PRIMEIRACOMPRA10' && user.hasMadePurchase) {
                    throw new Error("O cupom 'PRIMEIRACOMPRA10' é válido apenas na primeira compra.");
                }
                discountAmount = coupon.discountType === 'percentage' ? subtotal * (coupon.discountValue / 100) : coupon.discountValue;
            }

            const totalWithoutShipping = Math.max(0, subtotal - discountAmount);
            const finalTotal = totalWithoutShipping + (shippingCost || 0);
            
            for (const item of cartItems) {
                // CORREÇÃO: Usamos 'Product' diretamente
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }, { session });
            }

            const [newOrder] = await Order.create([{
                user: userId,
                items: cartItems,
                total: finalTotal,
                status: 'Processando',
                shippingAddress: shippingAddress,
            }], { session });
            
            user.cart = [];
            user.hasMadePurchase = true;
            await user.save({ session });
            
            await session.commitTransaction();

            res.status(200).json({ 
                message: "Compra finalizada com sucesso!", 
                orderId: newOrder._id 
            });

        } catch (error) {
            await session.abortTransaction();
            console.error("Erro detalhado no checkout:", error);
            res.status(400).json({ error: error.message || "Erro ao processar a compra." });
        } finally {
            session.endSession();
        }
    };
    
    // --- MÉTODOS DE ADMIN E HISTÓRICO ---
    static getOrderHistory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Utilizador não autenticado." });
            return;
        }
        try {
            const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: "Erro interno ao buscar histórico de pedidos." });
        }
    };

    static getAllOrders: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar todos os pedidos." });
        }
    };

    static updateOrderStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ error: "O status é obrigatório." });
            return;
        }
        try {
            const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
            if (!order) {
                res.status(404).json({ error: "Pedido não encontrado." });
                return;
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o status do pedido." });
        }
    };

    static deleteOrder: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const order = await Order.findByIdAndDelete(id);
            if (!order) {
                res.status(404).json({ error: "Pedido não encontrado." });
                return;
            }
            res.status(200).json({ message: "Pedido deletado com sucesso." });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar o pedido." });
        }
    };
}

export default OrderController;