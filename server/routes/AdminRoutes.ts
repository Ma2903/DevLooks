// server/routes/AdminRoutes.ts

import { Router } from "express";
import AdminController from "../controllers/AdminController";
import { verifyToken, verifyAdmin, verifyOwner } from "../middlewares/authMiddleware";

const router = Router();

// Rota para buscar todos os usuários (protegida para Admin e Owner)
router.get("/users", verifyToken, verifyAdmin, AdminController.getAllUsers);

// Rota para buscar um usuário por ID
router.get("/users/:id", verifyToken, verifyAdmin, AdminController.getUserById);

// Rota para atualizar um usuário
router.put("/users/:id", verifyToken, verifyAdmin, AdminController.updateUser);

// Rota para deletar um usuário (protegida apenas para Owner)
router.delete("/users/:id", verifyToken, verifyOwner, AdminController.deleteUser);

// ROTA PARA EXPORTAÇÃO
router.get("/admin/users/export", verifyToken, verifyOwner, AdminController.exportUsers);

// Rota antiga de extração de dados
router.get("/admin/extract", AdminController.extractData);

export default router;