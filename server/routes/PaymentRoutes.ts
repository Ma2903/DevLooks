import express from 'express';
import PaymentController from '../controllers/PaymentController';

const router = express.Router();

// Webhook do Mercado Pago (não precisa de autenticação)
router.post('/webhook', PaymentController.webhook);

// Rota de teste para verificar se o webhook está acessível
router.get('/webhook-test', (req, res) => {
    console.log('✅ [WebhookTest] Rota de teste acessada com sucesso!');
    res.json({ 
        message: 'Webhook está acessível!',
        url: 'https://devlooks.onrender.com/api/payment/webhook',
        timestamp: new Date().toISOString()
    });
});

// Consultar status de pagamento (opcional, para debug)
router.get('/status/:paymentId', PaymentController.getPaymentStatus);

export default router;
