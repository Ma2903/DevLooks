// server/routes/OrderRoutes.ts
import { Router } from "express";
import OrderController from "../controllers/OrderController";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware"; // Importe verifyAdmin

const router = Router();

// --- Rotas de Cliente ---
router.post("/orders/checkout", verifyToken, OrderController.checkout);
router.get("/orders/history", verifyToken, OrderController.getOrderHistory);

// --- Rotas de Admin ---
router.get("/orders", verifyToken, verifyAdmin, OrderController.getAllOrders);
router.put("/orders/:id/status", verifyToken, verifyAdmin, OrderController.updateOrderStatus);
router.delete("/orders/:id", verifyToken, verifyAdmin, OrderController.deleteOrder);


export default router;