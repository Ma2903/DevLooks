import { Router } from "express";
import CouponController from "../controllers/CouponController";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware"; // Importe o novo middleware

const router = Router();

// Rotas de gerenciamento (protegidas)
router.post("/coupons", verifyToken, verifyAdmin, CouponController.createCoupon); // Adicionado verifyAdmin
router.get("/coupons", verifyToken, verifyAdmin, CouponController.getAllCoupons); // Adicionado verifyAdmin
router.get("/coupons/:id", verifyToken, verifyAdmin, CouponController.getCouponById); // Adicionado verifyAdmin
router.put("/coupons/:id", verifyToken, verifyAdmin, CouponController.updateCoupon); // Adicionado verifyAdmin
router.delete("/coupons/:id", verifyToken, verifyAdmin, CouponController.deleteCoupon); // Adicionado verifyAdmin

// Rota pública para validação no carrinho
router.post("/coupons/validate", CouponController.validateCoupon);

export default router;