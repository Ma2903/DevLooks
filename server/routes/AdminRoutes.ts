// server/routes/AdminRoutes.ts

import { Router } from "express";
import AdminController from "../controllers/AdminController";
import { verifyToken, verifyAdmin, verifyOwner } from "../middlewares/authMiddleware";

const router = Router();

// --- CORREÇÃO APLICADA AQUI ---
// A rota agora é '/admin/users' para corresponder à chamada do frontend
router.get("/admin/users", verifyToken, verifyAdmin, AdminController.getAllUsers);


// As rotas abaixo já estão corretas, pois herdarão o prefixo '/api' do index.ts
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