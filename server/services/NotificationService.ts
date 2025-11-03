import NotificationModel from '../models/NotificationModel';
import { Schema } from 'mongoose';

/**
 * NotificationService - Implementação do Padrão Observer
 * 
 * Este serviço atua como o "Subject" (Sujeito) no padrão Observer.
 * Quando eventos importantes acontecem no sistema, o serviço "notifica"
 * os usuários (Observers) criando registros de notificação.
 */
class NotificationService {
    /**
     * Notifica um usuário criando uma nova notificação
     * @param userId - ID do usuário a ser notificado
     * @param message - Mensagem da notificação
     * @param type - Tipo da notificação (order, system, promotion)
     * @param relatedId - ID relacionado (ex: ID do pedido)
     */
    static async notify(
        userId: string | Schema.Types.ObjectId,
        message: string,
        type: 'order' | 'system' | 'promotion' = 'system',
        relatedId?: string
    ): Promise<void> {
        try {
            await NotificationModel.create({
                user: userId,
                message,
                type,
                read: false,
                relatedId
            });
            
            console.log(`✅ Notificação criada para usuário ${userId}: ${message}`);
        } catch (error) {
            console.error('❌ Erro ao criar notificação:', error);
        }
    }

    /**
     * Notifica múltiplos usuários de uma só vez
     * @param userIds - Array de IDs de usuários
     * @param message - Mensagem da notificação
     * @param type - Tipo da notificação
     */
    static async notifyMultiple(
        userIds: (string | Schema.Types.ObjectId)[],
        message: string,
        type: 'order' | 'system' | 'promotion' = 'system'
    ): Promise<void> {
        try {
            const notifications = userIds.map(userId => ({
                user: userId,
                message,
                type,
                read: false
            }));

            await NotificationModel.insertMany(notifications);
            console.log(`✅ ${userIds.length} notificações criadas`);
        } catch (error) {
            console.error('❌ Erro ao criar notificações múltiplas:', error);
        }
    }

    /**
     * Notifica quando um pedido muda de status
     * @param userId - ID do usuário
     * @param orderId - ID do pedido
     * @param status - Novo status do pedido
     */
    static async notifyOrderStatusChange(
        userId: string | Schema.Types.ObjectId,
        orderId: string,
        status: string
    ): Promise<void> {
        const messages: Record<string, string> = {
            'Processando': `Seu pedido #${orderId.slice(-6)} está sendo processado!`,
            'Enviado': `🚚 Seu pedido #${orderId.slice(-6)} foi enviado!`,
            'Entregue': `✅ Seu pedido #${orderId.slice(-6)} foi entregue!`,
            'Cancelado': `❌ Seu pedido #${orderId.slice(-6)} foi cancelado.`
        };

        const message = messages[status] || `Status do pedido #${orderId.slice(-6)} atualizado para: ${status}`;
        await this.notify(userId, message, 'order', orderId);
    }

    /**
     * Busca notificações não lidas de um usuário
     * @param userId - ID do usuário
     * @returns Array de notificações não lidas
     */
    static async getUnreadNotifications(userId: string | Schema.Types.ObjectId) {
        try {
            const notifications = await NotificationModel
                .find({ user: userId, read: false })
                .sort({ createdAt: -1 })
                .limit(20);
            
            return notifications;
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
            return [];
        }
    }

    /**
     * Marca notificações como lidas
     * @param notificationIds - Array de IDs de notificações
     */
    static async markAsRead(notificationIds: string[]): Promise<void> {
        try {
            await NotificationModel.updateMany(
                { _id: { $in: notificationIds } },
                { read: true }
            );
            console.log(`✅ ${notificationIds.length} notificações marcadas como lidas`);
        } catch (error) {
            console.error('Erro ao marcar notificações como lidas:', error);
        }
    }

    /**
     * Marca todas as notificações de um usuário como lidas
     * @param userId - ID do usuário
     */
    static async markAllAsRead(userId: string | Schema.Types.ObjectId): Promise<void> {
        try {
            await NotificationModel.updateMany(
                { user: userId, read: false },
                { read: true }
            );
            console.log(`✅ Todas as notificações do usuário ${userId} foram marcadas como lidas`);
        } catch (error) {
            console.error('Erro ao marcar todas as notificações como lidas:', error);
        }
    }
}

export default NotificationService;
