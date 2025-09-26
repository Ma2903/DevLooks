// Ficheiro: server/routes/ProductRoutes.ts
import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware";

const router = Router();

// --- CORREÇÃO APLICADA AQUI ---
// A estrutura das rotas foi ajustada para evitar o erro de tipo.
// Em vez de passar o middleware de upload diretamente, ele já está
// sendo chamado dentro do método do controller, então não é necessário aqui.

router.get("/products/best-selling", ProductController.getBestSellingProducts);

router.post("/products", verifyToken, verifyAdmin, ProductController.uploadImage, ProductController.addProduct);

router.get("/products", ProductController.getAllProducts);

router.get("/products/:id", ProductController.getProductById);

router.put("/products/:id", verifyToken, verifyAdmin, ProductController.uploadImage, ProductController.updateProduct);

router.delete("/products/:id", verifyToken, verifyAdmin, ProductController.deleteProduct);

export default router;