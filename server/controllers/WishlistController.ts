import { Request, Response, RequestHandler } from 'express';
import WishlistModel from '../models/WishlistModel';
import ProductModel from '../models/ProductModel';
import NotificationService from '../services/NotificationService';

class WishlistController {
    static getWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;

            let wishlist = await WishlistModel.findOne({ user: userId })
                .populate('products');

            if (!wishlist) {
                wishlist = await WishlistModel.create({
                    user: userId,
                    products: []
                });
            }

            res.status(200).json({
                products: wishlist.products,
                totalItems: wishlist.products.length
            });

        } catch (error: any) {
            console.error('Erro ao buscar wishlist:', error);
            res.status(500).json({
                message: 'Erro ao buscar lista de desejos',
                error: error.message
            });
        }
    };

    static addToWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.body;

            if (!productId) {
                res.status(400).json({ message: 'ID do produto é obrigatório' });
                return;
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            let wishlist = await WishlistModel.findOne({ user: userId });

            if (!wishlist) {
                wishlist = await WishlistModel.create({
                    user: userId,
                    products: [productId]
                });

                await NotificationService.notify(
                    userId,
                    `✨ Produto "${product.name}" adicionado à sua lista de desejos!`,
                    'system'
                );

                res.status(201).json({
                    message: 'Produto adicionado à lista de desejos!',
                    totalItems: wishlist.products.length
                });
                return;
            }

            if (wishlist.products.some(p => p.toString() === productId)) {
                res.status(400).json({ message: 'Produto já está na lista de desejos' });
                return;
            }

            wishlist.products.push(productId);
            await wishlist.save();

            await NotificationService.notify(
                userId,
                `✨ Produto "${product.name}" adicionado à sua lista de desejos!`,
                'system'
            );

            res.status(200).json({
                message: 'Produto adicionado à lista de desejos!',
                totalItems: wishlist.products.length
            });

        } catch (error: any) {
            console.error('Erro ao adicionar à wishlist:', error);
            res.status(500).json({
                message: 'Erro ao adicionar produto',
                error: error.message
            });
        }
    };

    static removeFromWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.params;

            const wishlist = await WishlistModel.findOne({ user: userId });

            if (!wishlist) {
                res.status(404).json({ message: 'Lista de desejos não encontrada' });
                return;
            }

            const productIndex = wishlist.products.findIndex(
                p => p.toString() === productId
            );

            if (productIndex === -1) {
                res.status(404).json({ message: 'Produto não está na lista de desejos' });
                return;
            }

            wishlist.products.splice(productIndex, 1);
            await wishlist.save();

            res.status(200).json({
                message: 'Produto removido da lista de desejos',
                totalItems: wishlist.products.length
            });

        } catch (error: any) {
            console.error('Erro ao remover da wishlist:', error);
            res.status(500).json({
                message: 'Erro ao remover produto',
                error: error.message
            });
        }
    };

    static clearWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;

            const wishlist = await WishlistModel.findOne({ user: userId });

            if (!wishlist) {
                res.status(404).json({ message: 'Lista de desejos não encontrada' });
                return;
            }

            wishlist.products = [];
            await wishlist.save();

            res.status(200).json({
                message: 'Lista de desejos limpa com sucesso',
                totalItems: 0
            });

        } catch (error: any) {
            console.error('Erro ao limpar wishlist:', error);
            res.status(500).json({
                message: 'Erro ao limpar lista de desejos',
                error: error.message
            });
        }
    };

    static checkInWishlist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.params;

            const wishlist = await WishlistModel.findOne({ user: userId });

            if (!wishlist) {
                res.status(200).json({ inWishlist: false });
                return;
            }

            const inWishlist = wishlist.products.some(
                p => p.toString() === productId
            );

            res.status(200).json({ inWishlist });

        } catch (error: any) {
            console.error('Erro ao verificar wishlist:', error);
            res.status(500).json({
                message: 'Erro ao verificar lista de desejos',
                error: error.message
            });
        }
    };

    static moveToCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.body;

            if (!productId) {
                res.status(400).json({ message: 'ID do produto é obrigatório' });
                return;
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            if (product.stock <= 0) {
                res.status(400).json({ message: 'Produto sem estoque' });
                return;
            }

            const wishlist = await WishlistModel.findOne({ user: userId });
            if (wishlist) {
                const productIndex = wishlist.products.findIndex(
                    p => p.toString() === productId
                );
                if (productIndex !== -1) {
                    wishlist.products.splice(productIndex, 1);
                    await wishlist.save();
                }
            }

            await NotificationService.notify(
                userId,
                `🛒 Produto "${product.name}" movido da lista de desejos para o carrinho!`,
                'system'
            );

            res.status(200).json({
                message: 'Produto movido para o carrinho!',
                product: product
            });

        } catch (error: any) {
            console.error('Erro ao mover para carrinho:', error);
            res.status(500).json({
                message: 'Erro ao mover produto para carrinho',
                error: error.message
            });
        }
    };
}

export default WishlistController;
