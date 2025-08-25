import { Router } from "express";
import UserController from "../controllers/UserController";
import { verifyToken, verifyAdmin, verifyOwner } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import { createUserSchema } from "../validators/userValidator";

const router = Router();

// Rota de criação com validação
router.post("/users", validate(createUserSchema), UserController.createUser);

// Rotas de Autenticação e Perfil
router.post("/users/login", UserController.login);
router.post("/users/me", verifyToken, UserController.getUserById);

// Recuperação de Senha
router.post("/users/forgot-password", UserController.forgotPassword);
router.post("/users/reset-password", UserController.resetPassword);

// --- IMPORTANTE: Rota específica do avatar ANTES da rota genérica com :id ---
router.put("/users/avatar", verifyToken, UserController.saveAvatar);

// Rotas de Usuário (CRUD)
router.get("/users", verifyToken, verifyOwner, UserController.getAllUsers);
router.get("/users/:id", verifyToken, verifyOwner, UserController.getUserById);
router.put("/users/:id", verifyToken, verifyOwner, UserController.updateUser);
router.delete("/users/:id", verifyToken, verifyOwner, UserController.deleteUser);


export default router;