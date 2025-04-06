import { Router } from "express";
import { Request, Response } from "express";
import UserController from "../controllers/UserController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();


router.post("/users", UserController.createUser);
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

// Operações de autenticação
router.post("/users/login", UserController.login);
router.post("/users/me", verifyToken,UserController.getUserById );

export default router;
