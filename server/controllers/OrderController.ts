// Ficheiro: server/controllers/OrderController.ts
import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import UserModel from "../models/UserModel";
import ProductModel from "../models/ProductModel";
import CouponModel from "../models/CouponModel";
import OrderModel from "../models/OrderModel";

class OrderController {
    static checkout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { cartItems, couponCode, shippingCost, shippingAddress } = req.body;
        if (!userId) {
            res.status(401).json({ error: "Utilizador não autenticado." });
            return;
        }
        if (!cartItems || cartItems.length === 0) {
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
            const user = await UserModel.findById(userId).session(session);
            if (!user) throw new Error("Utilizador não encontrado.");

            let subtotal = 0;
            for (const item of cartItems) {
                const product = await ProductModel.findById(item.productId).session(session);
                if (!product) throw new Error(`Produto "${item.name}" não encontrado.`);
                if (product.stock < item.quantity) throw new Error(`Estoque insuficiente para "${item.name}".`);
                subtotal += product.price * item.quantity;
            }
            let discountAmount = 0;
            if (couponCode) {
                const coupon = await CouponModel.findOne({ code: couponCode }).session(session);
                if (!coupon || !coupon.isActive || new Date(coupon.expirationDate) < new Date()) {
                    throw new Error("Cupom inválido ou expirado.");
                }
                if (coupon.code === 'PRIMEIRACOMPRA10' && user.hasMadePurchase) {
                    throw new Error("Este cupom é válido apenas na primeira compra.");
                }
                discountAmount = coupon.discountType === 'percentage' ? subtotal * (coupon.discountValue / 100) : coupon.discountValue;
            }
            const finalTotal = Math.max(0, subtotal - discountAmount) + (shippingCost || 0);
            
            for (const item of cartItems) {
                await ProductModel.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }, { session });
            }
            const [newOrder] = await OrderModel.create([{
                user: userId, items: cartItems, total: finalTotal,
                status: 'Processando', shippingAddress: shippingAddress,
            }], { session });
            
            user.cart = [];
            user.hasMadePurchase = true;
            await user.save({ session });
            
            await session.commitTransaction();
            res.status(200).json({ message: "Compra finalizada com sucesso!", orderId: newOrder._id });
        } catch (error: any) {
            await session.abortTransaction();
            res.status(400).json({ error: error.message || "Erro ao processar a compra." });
        } finally {
            session.endSession();
        }
    };
    
    static getOrderHistory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Utilizador não autenticado." });
            return;
        }
        try {
            const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar histórico de pedidos." });
        }
    };

    static getAllOrders: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await OrderModel.find().populate('user', 'name email').sort({ createdAt: -1 });
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
            const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
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
            const order = await OrderModel.findByIdAndDelete(id);
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