import { Request, Response, RequestHandler } from "express";
import OrderModel from "../models/OrderModel";
import UserModel from "../models/UserModel";
import ProductModel from "../models/ProductModel";
import CouponModel from "../models/CouponModel";
// SDK v2: Novas importações
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { MERCADOPAGO_ACCESS_TOKEN } from "../config/config";

// SDK v2: Inicializa o cliente com as suas credenciais
const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });

class OrderController {
    static async checkout(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { items, shippingAddress, shippingCost, couponCode } = req.body;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            let total = 0;
            const items_for_mp: any[] = [];

            for (const item of items) {
                let productId: string | null = null;

                // --- LÓGICA DE EXTRAÇÃO DE ID REFORÇADA ---
                if (typeof item.product === 'object' && item.product !== null && item.product._id) {
                    // Se item.product for um objeto com a propriedade _id
                    productId = item.product._id.toString();
                    console.log(`[Checkout Log] ID extraído do objeto produto: ${productId}`);
                } else if (typeof item.product === 'string') {
                    // Se item.product já for uma string (o ID)
                    productId = item.product;
                    console.log(`[Checkout Log] ID do produto recebido como string: ${productId}`);
                } else {
                    // Caso contrário, a estrutura é inválida
                    console.error('[Checkout Error] Estrutura inválida para item.product no carrinho:', JSON.stringify(item, null, 2));
                    return res.status(400).json({ message: `Estrutura de dados inválida para um item do produto no carrinho.` });
                }

                // Verifica se o productId foi extraído com sucesso
                 if (!productId) {
                    console.error('[Checkout Error] Não foi possível determinar o ID do produto para o item:', JSON.stringify(item, null, 2));
                    return res.status(400).json({ message: `Não foi possível determinar o ID do produto para um item no carrinho.` });
                }

                console.log(`[Checkout Log] A procurar produto com ID: ${productId}`);
                const product = await ProductModel.findById(productId);

                console.log(`[Checkout Log] Resultado da base de dados para o ID ${productId}:`, product ? 'Encontrado' : 'Não Encontrado');

                if (!product || !product._id) {
                    console.error(`[Checkout Error] Produto não encontrado na DB ou _id em falta para o ID: ${productId}.`);
                    return res.status(404).json({ message: `Produto com ID ${productId} não encontrado ou inválido.` });
                }

                if (product.stock < item.quantity) {
                     console.warn(`[Checkout Warn] Estoque insuficiente para ${product.name} (ID: ${productId}). Pedido: ${item.quantity}, Estoque: ${product.stock}`);
                    return res.status(400).json({ message: `Estoque insuficiente para ${product.name}.` });
                }
                const itemPrice = (product.promotion_price ?? product.price) * item.quantity;
                total += itemPrice;

                items_for_mp.push({
                    id: product._id.toString(),
                    title: product.name,
                    quantity: item.quantity,
                    unit_price: (product.promotion_price ?? product.price),
                    currency_id: 'BRL',
                });
            }

             if (couponCode) {
                const coupon = await CouponModel.findOne({ code: couponCode, is_active: true });
                if (coupon) {
                    if (new Date() > coupon.expires_at) {
                         console.warn(`[Checkout Warn] Tentativa de usar cupão expirado: ${couponCode}`);
                        return res.status(400).json({ message: "Cupom expirado." });
                    }
                    const discount = (total * coupon.discount_percentage) / 100;
                    total -= discount;
                     console.log(`[Checkout Log] Cupão ${couponCode} aplicado. Desconto: ${discount.toFixed(2)}`);
                } else {
                     console.warn(`[Checkout Warn] Tentativa de usar cupão inválido: ${couponCode}`);
                    return res.status(404).json({ message: "Cupom inválido." });
                }
            }
            
            total += shippingCost;
             console.log(`[Checkout Log] Custo de envio adicionado: ${shippingCost.toFixed(2)}. Total atualizado: ${total.toFixed(2)}`);
            
            if (shippingCost > 0) {
                items_for_mp.push({
                    id: 'shipping',
                    title: 'Custo de Envio',
                    quantity: 1,
                    unit_price: shippingCost,
                    currency_id: 'BRL',
                });
            }

            const tempOrderId = `TEMP_${userId}_${Date.now()}`;

            const preferenceData = {
                items: items_for_mp,
                payer: {
                    name: user.name,
                    email: user.email,
                },
                back_urls: {
                    success: `http://localhost:8080/order/success`,
                    failure: `http://localhost:8080/order/failure`,
                    pending: `http://localhost:8080/order/pending`,
                },
                auto_return: "approved" as "approved",
                external_reference: tempOrderId,
                notification_url: `https://SEU_DOMINIO_PUBLICO/api/orders/webhook`, // Lembre-se de configurar isto depois
            };
            
             console.log('[Checkout Log] A criar preferência de pagamento com os dados:', JSON.stringify(preferenceData, null, 2));
            const preference = new Preference(client);
            const response = await preference.create({ body: preferenceData });
             console.log('[Checkout Log] Preferência de pagamento criada com sucesso. ID:', response.id);

            res.status(201).json({ 
                message: "Preferência de pagamento criada com sucesso.",
                payment_url: response.init_point, 
                preference_id: response.id
            });

        } catch (error: any) {
            console.error("Erro detalhado durante o checkout:", error); // Log do erro completo
            res.status(500).json({ 
                message: "Erro ao processar o checkout.",
                // Tenta fornecer uma mensagem de erro mais específica se disponível
                error: error?.cause?.message || error?.message || "Erro desconhecido" 
            });
        }
    }
    
    static getOrderHistory: RequestHandler = async (req, res) => {
        try {
            const userId = (req as any).user.id;
            const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
             console.error("Erro ao buscar histórico de pedidos:", error);
            res.status(500).json({ message: 'Erro ao buscar histórico de pedidos' });
        }
    };

    static getAllOrders: RequestHandler = async (req, res) => {
        try {
            const orders = await OrderModel.find().populate('user', 'name email').sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
             console.error("Erro ao buscar todos os pedidos:", error);
            res.status(500).json({ message: 'Erro ao buscar todos os pedidos' });
        }
    };

    static updateOrderStatus: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }
            res.json(order);
        } catch (error) {
             console.error(`Erro ao atualizar status do pedido ${req.params.id}:`, error);
            res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
        }
    };

    static deleteOrder: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const order = await OrderModel.findByIdAndDelete(id);
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }
            res.json({ message: 'Pedido deletado com sucesso' });
        } catch (error) {
             console.error(`Erro ao deletar pedido ${req.params.id}:`, error);
            res.status(500).json({ message: 'Erro ao deletar pedido' });
        }
    };
}

export default OrderController;