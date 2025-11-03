import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas de notificação requerem autenticação
router.get('/notifications/unread', verifyToken, NotificationController.getUnreadNotifications);
router.post('/notifications/mark-read', verifyToken, NotificationController.markAsRead);
router.post('/notifications/mark-all-read', verifyToken, NotificationController.markAllAsRead);

export default router;
