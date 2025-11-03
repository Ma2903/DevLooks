import { Router } from 'express';
import AIController from '../controllers/AIController';

const router = Router();

// Rotas de IA (não requerem autenticação para demonstração)
router.post('/ai/sentiment', AIController.analyzeSentiment);
router.post('/ai/summary', AIController.summarizeReviews);
router.post('/ai/sentiment-stats', AIController.getSentimentStats);

export default router;
