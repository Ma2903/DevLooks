import { Request, Response, RequestHandler } from 'express';
import Order from '../models/OrderModel';
import Product from '../models/ProductModel';
import mongoose from 'mongoose';

class OrderController {
    // Método para criar o pedido e diminuir o estoque
    static createOrder: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { userId, items, total, shippingAddress, paymentMethod } = req.body;

            // Passo 1: Verifica se há estoque para todos os itens do pedido
            for (const item of items) {
                const product = await Product.findById(item.productId).session(session);
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para o produto: ${product?.name || item.productId}`);
                }
            }

            // Passo 2: Cria o novo pedido
            const newOrder = new Order({
                userId,
                items,
                total,
                shippingAddress,
                paymentMethod,
                status: 'Pendente'
            });
            await newOrder.save({ session });

            // Passo 3: Diminui a quantidade do estoque para cada produto
            for (const item of items) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            // Confirma a transação (salva tudo no banco de dados)
            await session.commitTransaction();
            session.endSession();

            res.status(201).json(newOrder);

        } catch (error: any) {
            // Se algo der errado, desfaz todas as operações
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
        }
    };

    static getAllOrders: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await Order.find().populate('userId', 'name email');
            res.status(200).json(orders);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
        }
    };

    static getOrderById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const order = await Order.findById(req.params.id).populate('userId', 'name email');
            if (!order) {
                res.status(404).json({ message: 'Pedido não encontrado' });
                return;
            }
            res.status(200).json(order);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
        }
    };

    static updateOrderStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status } = req.body;
            const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
            if (!order) {
                res.status(404).json({ message: 'Pedido não encontrado' });
                return;
            }
            res.status(200).json(order);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao atualizar status do pedido', error: error.message });
        }
    };

    // Método para deletar o pedido e restaurar o estoque
    static deleteOrder: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId).session(session);

            if (!order) {
                throw new Error('Pedido não encontrado');
            }

            // Restaura o estoque para cada produto do pedido deletado
            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }

            // Agora deleta o pedido
            await Order.findByIdAndDelete(orderId, { session });

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ message: 'Pedido deletado e estoque restaurado com sucesso' });

        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            if (error.message === 'Pedido não encontrado') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Erro ao deletar pedido', error: error.message });
            }
        }
    };
}

export default OrderController;