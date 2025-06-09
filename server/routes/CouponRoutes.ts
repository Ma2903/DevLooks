// server/routes/CouponRoutes.ts

import { Router } from "express";
import CouponController from "../controllers/CouponController";
import { verifyToken } from "../middlewares/authMiddleware"; // Usaremos para proteger as rotas de admin

const router = Router();

// Rotas de gerenciamento (protegidas)
router.post("/coupons", verifyToken, CouponController.createCoupon);
router.get("/coupons", verifyToken, CouponController.getAllCoupons);
router.get("/coupons/:id", verifyToken, CouponController.getCouponById);
router.put("/coupons/:id", verifyToken, CouponController.updateCoupon);
router.delete("/coupons/:id", verifyToken, CouponController.deleteCoupon);

// Rota pública para validação no carrinho
router.post("/coupons/validate", CouponController.validateCoupon);


export default router;