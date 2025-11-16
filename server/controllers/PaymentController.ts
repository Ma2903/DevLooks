import { Request, Response, RequestHandler } from "express";
import OrderModel from "../models/OrderModel";
import ProductModel from "../models/ProductModel";
import UserModel from "../models/UserModel";
import NotificationService from "../services/NotificationService";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { MERCADOPAGO_ACCESS_TOKEN } from "../config/config";

const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });

class PaymentController {
    /**
     * Webhook do Mercado Pago
     * Recebe notificações sobre mudanças de status de pagamento
     */
    static webhook: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('🔔 [Webhook] Notificação recebida do Mercado Pago:', JSON.stringify(req.body, null, 2));
            console.log('📋 [Webhook] Query params:', req.query);

            const { type, data } = req.body;

            // Responde imediatamente ao MP para evitar timeout
            res.status(200).send('OK');

            // Processa apenas notificações de pagamento
            if (type === 'payment') {
                const paymentId = data.id;
                console.log(`💳 [Webhook] Processando pagamento ID: ${paymentId}`);

                // Busca detalhes do pagamento
                const payment = new Payment(client);
                const paymentInfo = await payment.get({ id: paymentId });

                console.log('📊 [Webhook] Status do pagamento:', paymentInfo.status);
                console.log('🔗 [Webhook] External Reference:', paymentInfo.external_reference);

                const externalReference = paymentInfo.external_reference;
                if (!externalReference) {
                    console.warn('⚠️ [Webhook] Pagamento sem external_reference');
                    return;
                }

                // Extrair userId e timestamp do external_reference (formato: TEMP_userId_timestamp)
                const parts = externalReference.split('_');
                if (parts.length < 3 || parts[0] !== 'TEMP') {
                    console.error('❌ [Webhook] Formato inválido de external_reference:', externalReference);
                    return;
                }

                const userId = parts[1];
                const user = await UserModel.findById(userId);
                
                if (!user) {
                    console.error(`❌ [Webhook] Usuário não encontrado: ${userId}`);
                    return;
                }

                // Mapear status do Mercado Pago para nosso sistema
                let orderStatus = 'pending';
                let notificationMessage = '';

                switch (paymentInfo.status) {
                    case 'approved':
                        orderStatus = 'paid';
                        notificationMessage = `✅ Pagamento aprovado! Pedido confirmado.`;
                        
                        // Criar pedido confirmado no banco
                        await PaymentController.createConfirmedOrder(paymentInfo, userId);
                        break;
                    
                    case 'pending':
                    case 'in_process':
                        orderStatus = 'pending';
                        notificationMessage = `⏳ Pagamento pendente. Aguardando confirmação.`;
                        break;
                    
                    case 'rejected':
                    case 'cancelled':
                        orderStatus = 'cancelled';
                        notificationMessage = `❌ Pagamento ${paymentInfo.status === 'rejected' ? 'recusado' : 'cancelado'}. Entre em contato se tiver dúvidas.`;
                        break;
                    
                    case 'refunded':
                        orderStatus = 'refunded';
                        notificationMessage = `💰 Pagamento estornado. O valor será devolvido.`;
                        break;
                }

                // Notificar usuário
                await NotificationService.notify(userId, notificationMessage, 'system');

                console.log(`✅ [Webhook] Processamento concluído para pagamento ${paymentId}`);
            }

        } catch (error: any) {
            console.error('❌ [Webhook] Erro ao processar notificação:', error);
            // Não retorna erro para o MP - já respondemos 200 OK
        }
    };

    /**
     * Cria um pedido confirmado após pagamento aprovado
     */
    private static async createConfirmedOrder(paymentInfo: any, userId: string) {
        try {
            console.log(`📦 [CreateOrder] Criando pedido para usuário ${userId}`);

            // Buscar endereço de entrega do metadata
            let shippingAddress = {
                street: 'A definir',
                number: '0',
                neighborhood: 'A definir',
                city: 'A definir',
                state: 'A definir',
                cep: '00000-000'
            };

            if (paymentInfo.metadata?.shipping_address) {
                try {
                    shippingAddress = JSON.parse(paymentInfo.metadata.shipping_address);
                    console.log('📍 [CreateOrder] Endereço recuperado do metadata:', shippingAddress);
                } catch (e) {
                    console.warn('⚠️ [CreateOrder] Erro ao parsear endereço do metadata');
                }
            }

            // Buscar itens do metadata primeiro (mais confiável)
            let items = [];
            if (paymentInfo.metadata?.items) {
                try {
                    items = JSON.parse(paymentInfo.metadata.items);
                    console.log('📦 [CreateOrder] Itens recuperados do metadata:', items);
                } catch (e) {
                    console.warn('⚠️ [CreateOrder] Erro ao parsear itens do metadata, usando additional_info');
                    items = paymentInfo.additional_info?.items || [];
                }
            } else {
                items = paymentInfo.additional_info?.items || [];
            }
            
            const orderItems = [];
            let total = 0;

            for (const item of items) {
                // Se veio do metadata, já tem o ID correto
                const productId = item.product || item.id;
                
                // Pular item de frete
                if (productId === 'shipping') {
                    continue;
                }

                const product = await ProductModel.findById(productId);
                if (!product) {
                    console.warn(`⚠️ [CreateOrder] Produto não encontrado: ${productId}`);
                    continue;
                }

                const quantity = item.quantity;
                
                // Reduzir estoque
                product.stock -= quantity;
                await product.save();
                console.log(`📉 [CreateOrder] Estoque reduzido: ${product.name} (${product.stock} restantes)`);

                orderItems.push({
                    product: product._id,
                    quantity: quantity,
                    price: product.promotion_price || product.price,
                });

                total += (product.promotion_price || product.price) * quantity;
            }

            // Criar pedido
            const order = await OrderModel.create({
                user: userId,
                items: orderItems,
                total: paymentInfo.transaction_amount,
                status: 'paid',
                paymentMethod: paymentInfo.payment_method_id,
                paymentStatus: paymentInfo.status,
                mercadoPagoPaymentId: paymentInfo.id,
                shippingAddress: shippingAddress
            });

            console.log(`✅ [CreateOrder] Pedido criado com sucesso: ${order._id}`);

            // Limpar carrinho do usuário
            const user = await UserModel.findById(userId);
            if (user) {
                user.cart = [];
                await user.save();
            }

            // Notificar sobre o pedido
            await NotificationService.notify(
                userId,
                `🎉 Seu pedido #${order._id} foi confirmado e está sendo preparado!`,
                'order'
            );

        } catch (error) {
            console.error('❌ [CreateOrder] Erro ao criar pedido:', error);
            throw error;
        }
    }

    /**
     * Consultar status de pagamento
     */
    static getPaymentStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentId } = req.params;
            
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: paymentId });

            res.json({
                status: paymentInfo.status,
                status_detail: paymentInfo.status_detail,
                transaction_amount: paymentInfo.transaction_amount,
                payment_method_id: paymentInfo.payment_method_id,
            });

        } catch (error: any) {
            console.error('Erro ao consultar pagamento:', error);
            res.status(500).json({ 
                message: 'Erro ao consultar status do pagamento',
                error: error.message 
            });
        }
    };
}

export default PaymentController;
