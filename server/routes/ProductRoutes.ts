import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.get("/products/latest", ProductController.getLatestProducts);
router.get("/products/best-selling", ProductController.getBestSellingProducts);
router.post("/products", verifyToken, verifyAdmin, ProductController.uploadImage, ProductController.addProduct);
router.get("/products", ProductController.getAllProducts);
router.get("/products/:id", ProductController.getProductById);
router.put("/products/:id", verifyToken, verifyAdmin, ProductController.uploadImage, ProductController.updateProduct);
router.delete("/products/:id", verifyToken, verifyAdmin, ProductController.deleteProduct);

export default router;