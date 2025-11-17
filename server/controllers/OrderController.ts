import { Request, Response, RequestHandler } from "express";
import OrderModel from "../models/OrderModel";
import UserModel from "../models/UserModel";
import ProductModel from "../models/ProductModel";
import CouponModel from "../models/CouponModel";
import NotificationService from "../services/NotificationService";
// SDK v2: Novas importações
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { MERCADOPAGO_ACCESS_TOKEN } from "../config/config";

// SDK v2: Inicializa o cliente com as suas credenciais
console.log('🔑 [MercadoPago] Inicializando com token:', MERCADOPAGO_ACCESS_TOKEN ? `${MERCADOPAGO_ACCESS_TOKEN.substring(0, 15)}...` : 'TOKEN NÃO ENCONTRADO');
const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });

class OrderController {
    static async checkout(req: Request, res: Response) {
        console.log('🛒 [Checkout] Requisição recebida!');
        console.log('📦 [Checkout] Body:', JSON.stringify(req.body, null, 2));
        console.log('👤 [Checkout] User ID:', (req as any).user?.id);
        
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
                const coupon = await CouponModel.findOne({ 
                    code: couponCode.toUpperCase(), 
                    isActive: true 
                });
                
                if (coupon) {
                    if (new Date() > coupon.expirationDate) {
                         console.warn(`[Checkout Warn] Tentativa de usar cupão expirado: ${couponCode}`);
                        return res.status(400).json({ message: "Cupom expirado." });
                    }
                    
                    let discount = 0;
                    if (coupon.discountType === 'percentage') {
                        discount = (total * coupon.discountValue) / 100;
                    } else if (coupon.discountType === 'fixed') {
                        discount = coupon.discountValue;
                    }
                    
                    total -= discount;
                    console.log(`[Checkout Log] Cupão ${couponCode} aplicado. Tipo: ${coupon.discountType}, Valor: ${coupon.discountValue}, Desconto: R$ ${discount.toFixed(2)}`);
                } else {
                     console.warn(`[Checkout Warn] Cupão não encontrado ou inativo: ${couponCode}. Prosseguindo sem desconto.`);
                }
            }
            
            const finalShippingCost = shippingCost || 0;
            total += finalShippingCost;
            console.log(`[Checkout Log] Custo de envio adicionado: ${finalShippingCost.toFixed(2)}. Total atualizado: ${total.toFixed(2)}`);
            
            if (finalShippingCost > 0) {
                items_for_mp.push({
                    id: 'shipping',
                    title: 'Custo de Envio',
                    quantity: 1,
                    unit_price: finalShippingCost,
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
                    success: `https://devlooks.vercel.app/order/success`,
                    failure: `https://devlooks.vercel.app/order/failure`,
                    pending: `https://devlooks.vercel.app/order/pending`,
                },
                external_reference: tempOrderId,
                statement_descriptor: "DevLooks",
                metadata: {
                    shipping_address: JSON.stringify(shippingAddress),
                    items: JSON.stringify(items.map(item => ({
                        product: typeof item.product === 'object' && item.product?._id ? item.product._id : item.product,
                        quantity: item.quantity,
                        selectedSize: item.selectedSize
                    })))
                }
            };
            
             console.log('[Checkout Log] A criar preferência de pagamento com os dados:', JSON.stringify(preferenceData, null, 2));
            const preference = new Preference(client);
            
            console.log('💳 [MercadoPago] Enviando requisição para criar preferência...');
            const response = await preference.create({ body: preferenceData });
            console.log('✅ [MercadoPago] Preferência criada com sucesso. ID:', response.id);
            console.log('✅ [MercadoPago] Init point:', response.init_point);

            res.status(201).json({ 
                message: "Preferência de pagamento criada com sucesso.",
                payment_url: response.init_point, 
                preference_id: response.id
            });

        } catch (error: any) {
            console.error("❌ [Checkout Error] Erro detalhado durante o checkout:", error);
            console.error("❌ [Checkout Error] Stack trace:", error.stack);
            console.error("❌ [Checkout Error] Cause:", error.cause);
            res.status(500).json({ 
                message: "Erro ao processar o checkout.",
                error: error?.cause?.message || error?.message || "Erro desconhecido",
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
            
            // Padrão Observer: Notifica o usuário sobre a mudança de status
            await NotificationService.notifyOrderStatusChange(
                order.user.toString(),
                String(order._id),
                status
            );
            
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