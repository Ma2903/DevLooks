// server/routes/ShippingRoutes.ts
import { Router } from "express";
import ShippingController from "../controllers/ShippingController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Rota para calcular o frete (protegida, pois só quem está logado pode calcular)
router.post("/shipping/calculate", verifyToken, ShippingController.calculateShipping);

export default router;