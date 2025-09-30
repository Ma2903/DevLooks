// server/routes/UserRoutes.ts

import { Router } from 'express';
import UserController from '../controllers/UserController';
import { validate } from '../middlewares/validationMiddleware';
import { createUserSchema } from '../validators/userValidator';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// Rotas públicas
router.post('/users/register', validate(createUserSchema), UserController.createUser);
router.post('/users/login', UserController.login);
router.post('/users/forgot-password', UserController.forgotPassword);
router.post('/users/reset-password', UserController.resetPassword);

// Rotas protegidas para o próprio usuário
router.get('/users/me', verifyToken, UserController.getMe);
router.delete('/users/me', verifyToken, UserController.deleteSelf); // ROTA ADICIONADA AQUI
router.delete('/users/avatar', verifyToken, UserController.deleteSavedAvatar);

// Rotas protegidas para usuários específicos (si mesmo ou admin)
router.get('/users/:id', verifyToken, UserController.getUserById);
router.put('/users/:id', verifyToken, UserController.updateUser);

export default router;