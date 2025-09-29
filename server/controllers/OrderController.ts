// server/controllers/OrderController.ts

import { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import Order from '../models/OrderModel';
import Product from '../models/ProductModel';
import UserModel from '../models/UserModel'; // Importar UserModel
import CouponModel from '../models/CouponModel'; // Importar CouponModel

class OrderController {
    static checkout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const userId = (req as any).user.id;
            const { cartItems, shippingAddress, paymentMethod, couponCode, shippingCost } = req.body;

            if (!cartItems || cartItems.length === 0) {
                throw new Error('O carrinho está vazio.');
            }

            let total = 0;
            for (const item of cartItems) {
                const product = await Product.findById(item.productId).session(session);
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para o produto: ${product?.name || item.productId}`);
                }
                total += product.price * item.quantity;
            }

            if (couponCode) {
                const coupon = await CouponModel.findOne({ code: couponCode }).session(session);
                if (coupon) {
                    if (coupon.discountType === 'percentage') {
                        total *= (1 - coupon.discountValue / 100);
                    } else {
                        total -= coupon.discountValue;
                    }
                }
            }
            total = Math.max(0, total) + (shippingCost || 0);

            const newOrder = new Order({
                user: userId,
                items: cartItems,
                total,
                shippingAddress,
                paymentMethod,
                status: 'Processando'
            });
            await newOrder.save({ session });

            for (const item of cartItems) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
                
                // << LÓGICA DO PASSE DE AVATAR >>
                const product = await Product.findById(item.productId).session(session);
                if (product && product.name === 'Passe de Avatar') {
                    await UserModel.updateOne(
                        { _id: userId },
                        { $inc: { avatarPasses: item.quantity } },
                        { session }
                    );
                }
            }

            // << LÓGICA DO CUPOM DE USO ÚNICO >>
            if (couponCode) {
                const coupon = await CouponModel.findOne({ code: couponCode }).session(session);
                if (coupon && coupon.isSingleUse) {
                    await UserModel.updateOne(
                        { _id: userId },
                        { $addToSet: { usedCoupons: coupon.code } },
                        { session }
                    );
                }
            }
            
            await UserModel.updateOne({ _id: userId }, { $set: { cart: [], hasMadePurchase: true } }, { session });

            await session.commitTransaction();
            res.status(201).json(newOrder);

        } catch (error: any) {
            await session.abortTransaction();
            res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
        } finally {
            session.endSession();
        }
    };
    
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
            const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
            res.json(updatedOrder);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
        }
    };

    static deleteOrder: RequestHandler = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const order = await Order.findById(req.params.id).session(session);
            if (!order) throw new Error('Pedido não encontrado');

            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } }, { session });
            }
            await Order.findByIdAndDelete(req.params.id, { session });
            
            await session.commitTransaction();
            res.json({ message: 'Pedido deletado e estoque restaurado com sucesso.' });
        } catch (error: any) {
            await session.abortTransaction();
            res.status(500).json({ message: 'Erro ao deletar pedido', error: error.message });
        } finally {
            session.endSession();
        }
    };
}

export default OrderController;