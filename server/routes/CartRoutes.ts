import { Router } from "express";
import CartController from "../controllers/CartController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Todas as rotas do carrinho são protegidas, exigem login
router.get("/cart", verifyToken, CartController.getCart);
router.post("/cart/add", verifyToken, CartController.addToCart);
router.put("/cart/update", verifyToken, CartController.updateCart);

export default router;