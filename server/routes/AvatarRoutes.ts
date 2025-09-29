// server/routes/AvatarRoutes.ts

import { Router } from 'express';
import AvatarController from '../controllers/AvatarController';

const router = Router();

// Rota para salvar/definir um avatar
// POST -> /api/avatar/
router.post('/', AvatarController.saveAvatar);

// Rota para deletar um avatar da galeria do usuário
// DELETE -> /api/avatar/
router.delete('/', AvatarController.deleteAvatar);

export default router;