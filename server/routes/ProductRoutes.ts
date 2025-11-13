import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware";

const router = Router();

// 1. Rotas mais específicas vêm primeiro
router.get("/products/latest", ProductController.getLatestProducts);
router.get("/products/best-selling", ProductController.getBestSellingProducts);

// 2. Rotas de criação (POST)
router.post("/products", verifyToken, verifyAdmin, ProductController.uploadImage, ProductController.addProduct);

// 3. Rota genérica para buscar todos os produtos
router.get("/products", ProductController.getAllProducts);

// 4. Rotas de Avaliação (Reviews) - DEVEM VIR ANTES DAS ROTAS COM :id
router.post("/products/:id/review", verifyToken, ProductController.uploadReviewImages, ProductController.addReview);
router.put("/products/:id/review", verifyToken, ProductController.uploadReviewImages, ProductController.updateReview);
router.delete("/products/:id/review", verifyToken, ProductController.deleteReview);
router.delete("/products/:id/review/image", verifyToken, ProductController.deleteReviewImage);
router.get("/products/:id/reviews", ProductController.getProductReviews);
router.get("/products/:id/can-review", verifyToken, ProductController.checkUserCanReview);

// 5. Rotas genéricas com parâmetros (como :id) vêm por último
router.get("/products/:id", ProductController.getProductById);
router.put("/products/:id", verifyToken, verifyAdmin, ProductController.uploadImage, ProductController.updateProduct);
router.delete("/products/:id", verifyToken, verifyAdmin, ProductController.deleteProduct);

export default router;