// Ficheiro: DevLooks-main/server/routes/OrderRoutes.ts

import { Router } from "express";
import OrderController from "../controllers/OrderController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Rota para finalizar a compra (protegida por token)
router.post("/orders/checkout", verifyToken, OrderController.checkout);

export default router;