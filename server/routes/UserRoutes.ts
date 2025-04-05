import { Router } from "express";
import { Request, Response } from "express";
import UserController from "../controllers/UserController";

const router = Router();


router.post("/users", UserController.createUser);
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;
