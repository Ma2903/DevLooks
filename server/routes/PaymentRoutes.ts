import express from 'express';
import PaymentController from '../controllers/PaymentController';

const router = express.Router();

// Webhook do Mercado Pago (não precisa de autenticação)
router.post('/webhook', PaymentController.webhook);

// Consultar status de pagamento (opcional, para debug)
router.get('/status/:paymentId', PaymentController.getPaymentStatus);

export default router;
