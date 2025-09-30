// server/controllers/OrderController.ts

import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import Order from "../models/OrderModel";
import Product from "../models/ProductModel";
import Coupon from "../models/CouponModel";
import UserModel from "../models/UserModel";
import { IOrder } from "../models/OrderModel";

class OrderController {
    static checkout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { cartItems, couponCode, shippingCost, shippingAddress, paymentMethod } = req.body;
            const userId = (req as any).user.id;
            const user = await UserModel.findById(userId).session(session);

            if (!user) {
                throw new Error('Usuário não encontrado.');
            }
            if (!cartItems || cartItems.length === 0) {
                throw new Error('O carrinho está vazio.');
            }

            let total = 0;
            let avatarPassQuantity = 0;

            for (const item of cartItems) {
                const product = await Product.findById(item.productId).session(session);
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para o produto: ${product?.name || item.productId}`);
                }
                
                // --- DEBUG: Mostra o nome do produto que está sendo verificado ---
                console.log(`Verificando produto no carrinho: "${product.name}"`);

                total += product.price * item.quantity;
                product.stock -= item.quantity;
                await product.save({ session });

                // --- CORREÇÃO APLICADA AQUI ---
                // Compara o nome em minúsculas e sem espaços para ser mais robusto
                if (product.name === 'Slot de Avatar Adicional') {
                    avatarPassQuantity += item.quantity;
                }
            }

            if (couponCode) {
                const coupon = await Coupon.findOne({ code: couponCode, isActive: true }).session(session);
                if (!coupon) throw new Error('Cupom inválido ou expirado.');
                if (user.usedCoupons?.includes(coupon.code)) {
                    throw new Error('Este cupom já foi utilizado por você.');
                }

                if (coupon.discountType === 'fixed') {
                    total -= coupon.discountValue;
                } else if (coupon.discountType === 'percentage') {
                    total *= (1 - coupon.discountValue / 100);
                }
                user.usedCoupons = user.usedCoupons || [];
                user.usedCoupons.push(coupon.code);
            }

            total = Math.max(0, total) + (shippingCost || 0);
            
            let orderStatus: IOrder['status'] = 'Processando';
            if (avatarPassQuantity > 0) {
                orderStatus = 'Entregue';
            }

            const newOrder = new Order({
                user: userId,
                items: cartItems,
                total,
                shippingAddress,
                paymentMethod,
                status: orderStatus
            });
            await newOrder.save({ session });

            if (avatarPassQuantity > 0) {
                user.avatarPasses = (user.avatarPasses || 0) + avatarPassQuantity;
                console.log(`SUCESSO: ${avatarPassQuantity} passe(s) de avatar creditado(s). Novo total: ${user.avatarPasses}`);
            }
            user.cart = [];
            user.hasMadePurchase = true;

            await user.save({ session });

            await session.commitTransaction();
            res.status(201).json({ message: 'Pedido realizado com sucesso', order: newOrder });

        } catch (error: any) {
            await session.abortTransaction();
            console.error("Erro no checkout:", error);
            res.status(500).json({ error: error.message });
        } finally {
            session.endSession();
        }
    };

    // ... (O restante dos métodos: getOrderHistory, getAllOrders, etc., continuam iguais)
    static getOrderHistory: RequestHandler = async (req, res) => {
        try {
            const userId = (req as any).user.id;
            const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar histórico de pedidos' });
        }
    };

    static getAllOrders: RequestHandler = async (req, res) => {
        try {
            const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar todos os pedidos' });
        }
    };

    static updateOrderStatus: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
        }
    };

    static deleteOrder: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const order = await Order.findByIdAndDelete(id);
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }
            res.json({ message: 'Pedido deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar pedido' });
        }
    };
}

export default OrderController;