import express from 'express';
import PaymentController from '../controllers/PaymentController';

const router = express.Router();

// Webhook do Mercado Pago (não precisa de autenticação)
router.post('/webhook', PaymentController.webhook);

// Rota de teste para verificar se o webhook está acessível (GET e POST)
router.get('/webhook-test', (req, res) => {
    console.log('✅ [WebhookTest] Rota de teste GET acessada!');
    res.json({ 
        message: 'Webhook está acessível via GET!',
        webhookUrl: 'https://devlooks.onrender.com/api/payment/webhook',
        method: 'POST',
        timestamp: new Date().toISOString()
    });
});

router.post('/webhook-test', (req, res) => {
    console.log('✅ [WebhookTest] Rota de teste POST acessada!');
    console.log('Body:', req.body);
    res.json({ 
        message: 'Webhook está acessível via POST!',
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});

// Consultar status de pagamento (opcional, para debug)
router.get('/status/:paymentId', PaymentController.getPaymentStatus);

export default router;
