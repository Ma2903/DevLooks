import { Request, Response, RequestHandler } from 'express';
import NotificationService from '../services/NotificationService';

class NotificationController {
    static getUnreadNotifications: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const notifications = await NotificationService.getUnreadNotifications(userId);
            
            res.status(200).json({
                count: notifications.length,
                notifications
            });
        } catch (error: any) {
            console.error('Erro ao buscar notificações:', error);
            res.status(500).json({ 
                message: 'Erro ao buscar notificações',
                error: error.message 
            });
        }
    };

    static markAsRead: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { notificationIds } = req.body;

            if (!notificationIds || !Array.isArray(notificationIds)) {
                res.status(400).json({ message: 'notificationIds deve ser um array' });
                return;
            }

            await NotificationService.markAsRead(notificationIds);
            res.status(200).json({ message: 'Notificações marcadas como lidas' });
        } catch (error: any) {
            console.error('Erro ao marcar notificações como lidas:', error);
            res.status(500).json({ 
                message: 'Erro ao marcar notificações como lidas',
                error: error.message 
            });
        }
    };

    static markAllAsRead: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            await NotificationService.markAllAsRead(userId);
            res.status(200).json({ message: 'Todas as notificações foram marcadas como lidas' });
        } catch (error: any) {
            console.error('Erro ao marcar todas as notificações como lidas:', error);
            res.status(500).json({ 
                message: 'Erro ao marcar todas as notificações como lidas',
                error: error.message 
            });
        }
    };
}

export default NotificationController;
