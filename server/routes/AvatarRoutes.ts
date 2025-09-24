// Arquivo: DevLooks-main/server/routes/AvatarRoutes.ts

import { Router } from 'express';
import AvatarController from '../controllers/AvatarController';

const router = Router();

// Rota que o frontend irá chamar
router.get('/avatar/proxy', AvatarController.getAvatar);

export default router;