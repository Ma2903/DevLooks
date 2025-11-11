import express from 'express';
import WishlistController from '../controllers/WishlistController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticate, WishlistController.getWishlist);

router.post('/add', authenticate, WishlistController.addToWishlist);

router.delete('/remove/:productId', authenticate, WishlistController.removeFromWishlist);

router.delete('/clear', authenticate, WishlistController.clearWishlist);

router.get('/check/:productId', authenticate, WishlistController.checkInWishlist);

router.post('/move-to-cart', authenticate, WishlistController.moveToCart);

export default router;
