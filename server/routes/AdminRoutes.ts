// server/routes/AdminRoutes.ts

import { Router } from "express";
import AdminController from "../controllers/AdminController";
import { verifyToken, verifyAdmin, verifyOwner } from "../middlewares/authMiddleware";

const router = Router();

router.get("/admin/users", verifyToken, verifyAdmin, AdminController.getAllUsers);
router.get("/users/:id", verifyToken, verifyAdmin, AdminController.getUserById);
router.put("/users/:id", verifyToken, verifyAdmin, AdminController.updateUser);
router.delete("/users/:id", verifyToken, verifyOwner, AdminController.deleteUser);
router.get("/admin/extract", AdminController.extractData);


// --- CORREÇÃO APLICADA AQUI ---
// A rota agora é '/admin/export' e usa 'verifyAdmin'
router.get("/admin/export", verifyToken, verifyAdmin, AdminController.exportUsers);


export default router;