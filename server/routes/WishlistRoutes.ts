import express from 'express';
import WishlistController from '../controllers/WishlistController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', verifyToken, WishlistController.getWishlist);

router.post('/add', verifyToken, WishlistController.addToWishlist);

router.delete('/remove/:productId', verifyToken, WishlistController.removeFromWishlist);

router.delete('/clear', verifyToken, WishlistController.clearWishlist);

router.get('/check/:productId', verifyToken, WishlistController.checkInWishlist);

router.post('/move-to-cart', verifyToken, WishlistController.moveToCart);

export default router;
