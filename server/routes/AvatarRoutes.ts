// server/routes/AvatarRoutes.ts

import { Router } from 'express';
import AvatarController from '../controllers/AvatarController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// ROTA PÚBLICA para o proxy (usada pela tag <img> e downloads)
router.get('/avatar/proxy', AvatarController.proxyAvatar);

// ROTA PRIVADA para salvar/atualizar o avatar de perfil
router.put('/users/avatar', verifyToken, AvatarController.saveAvatar);

export default router;