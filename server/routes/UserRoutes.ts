import { Router, Request, Response, NextFunction } from "express";
import UserController from "../controllers/UserController";
import { verifyToken, verifyOwner } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import { createUserSchema } from "../validators/userValidator";

const router = Router();

// Middleware para verificar se é o próprio usuário ou o dono
const verifySelfOrOwner = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.id === req.params.id || req.user.role === 'owner') {
        next();
    } else {
        res.status(403).json({ message: "Acesso proibido." });
    }
};

// --- ROTAS PÚBLICAS ---
router.post("/users", validate(createUserSchema), UserController.createUser);
router.post("/users/login", UserController.login);
router.post("/users/forgot-password", UserController.forgotPassword);
router.post("/users/reset-password", UserController.resetPassword);

// --- ROTAS PROTEGIDAS (exigem token) ---
// ROTA CORRIGIDA
router.get("/users/me", verifyToken, UserController.getMe); 
router.put("/users/avatar", verifyToken, UserController.saveAvatar);

// Rota para buscar um usuário específico (dono ou o próprio usuário)
router.get("/users/:id", verifyToken, verifySelfOrOwner, UserController.getUserById);

// Rota para atualizar um usuário (dono ou o próprio usuário)
router.put("/users/:id", verifyToken, verifySelfOrOwner, UserController.updateUser);

// Rota para deletar um usuário (dono ou o próprio usuário)
router.delete("/users/:id", verifyToken, verifySelfOrOwner, UserController.deleteUser);

// --- ROTAS DE ADMIN/OWNER ---
router.get("/users", verifyToken, verifyOwner, UserController.getAllUsers);

export default router;