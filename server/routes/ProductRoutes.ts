import { Router } from "express";
import ProductController from "../controllers/ProductController";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware"; // Importe os middlewares

const router = Router();

// Adicione os middlewares a todas as rotas de produto
router.post("/products", verifyToken, verifyAdmin, ProductController.addProduct);
router.get("/products", ProductController.getAllProducts); // A listagem pode ser pública
router.get("/products/:id", ProductController.getProductById); // A visualização pode ser pública
router.put("/products/:id", verifyToken, verifyAdmin, ProductController.updateProduct);
router.delete("/products/:id", verifyToken, verifyAdmin, ProductController.deleteProduct);

export default router;