// Ficheiro: server/controllers/ProductController.ts
import { Request, Response, RequestHandler } from 'express';
import ProductModel from '../models/ProductModel';
import OrderModel from '../models/OrderModel';

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './public/images/products',
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Configuração específica para reviews (permite múltiplas imagens)
const reviewStorage = multer.diskStorage({
    destination: './public/images/reviews',
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const reviewUpload = multer({ storage: reviewStorage });

class ProductController {
    static addProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, description, price, category, stock, sizes } = req.body;
            const image = req.file ? path.join('public/images/products', req.file.filename) : '';
            
            const newProduct = await ProductModel.create({
                name, description, price, category, stock, image,
                sizes: sizes ? (Array.isArray(sizes) ? sizes : [sizes]) : []
            });
            res.status(201).json(newProduct);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao adicionar produto', error: error.message });
        }
    };

    static getAllProducts: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
        try {
            const products = await ProductModel.find();
            res.status(200).json(products);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
        }
    };

    static getProductById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await ProductModel.findById(req.params.id);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json(product);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
        }
    };

    static updateProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const productData = req.body;
            if (req.file) {
                productData.image = path.join('public/images/products', req.file.filename);
            }
            if(productData.sizes && !Array.isArray(productData.sizes)) {
                 productData.sizes = [productData.sizes];
            }

            const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, productData, { new: true });
            if (!updatedProduct) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json(updatedProduct);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
        }
    };

    static deleteProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
            if (!deletedProduct) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json({ message: 'Produto deletado com sucesso' });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
        }
    };

    // <<-- CORREÇÃO APLICADA AQUI -->>
    static getBestSellingProducts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
          const bestSellingProducts = await OrderModel.aggregate([
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.productId',
                totalSold: { $sum: '$items.quantity' },
              },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 8 },
            {
              $lookup: {
                from: 'products', // A coleção de produtos
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails',
              },
            },
            { $unwind: '$productDetails' },
            // Esta é a linha chave que "promove" os detalhes do produto para o nível principal do documento
            {
              $replaceRoot: { newRoot: '$productDetails' }
            },
          ]);
      
          res.status(200).json(bestSellingProducts);
        } catch (error: any) {
          res.status(500).json({ message: 'Erro ao buscar produtos mais vendidos', error: error.message });
        }
    };

    static getLatestProducts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const latestProducts = await ProductModel.find()
                .sort({ createdAt: -1 })
                .limit(8);
            res.status(200).json(latestProducts);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar produtos recentes', error: error.message });
        }
    };

    static addReview: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id;
            const userId = (req as any).user.id; 
            const { rating, comment } = req.body;

            // Pega as imagens enviadas (req.files se for array de imagens)
            const images: string[] = [];
            if (req.files && Array.isArray(req.files)) {
                images.push(...req.files.map(file => path.join('public/images/reviews', file.filename)));
            } else if (req.file) {
                images.push(path.join('public/images/reviews', req.file.filename));
            }

            // 1. Validação básica
            if (!rating || rating < 1 || rating > 5) {
                res.status(400).json({ message: 'Nota deve ser entre 1 e 5' });
                return;
            }
            if (!comment || comment.trim() === '') {
                res.status(400).json({ message: 'Comentário é obrigatório' });
                return;
            }

            // 2. Verifica se o produto existe
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            // 3. Verificação de segurança: usuário comprou e recebeu o produto?
            const OrderModel = (await import('../models/OrderModel')).default;
            const userOrder = await OrderModel.findOne({
                user: userId,
                'items.productId': productId,
                status: 'Entregue'
            });

            if (!userOrder) {
                res.status(403).json({ 
                    message: 'Você só pode avaliar produtos que já comprou e recebeu' 
                });
                return;
            }

            // 4. Verifica se o usuário já avaliou este produto
            const existingReview = product.reviews?.find(
                review => review.user.toString() === userId
            );

            if (existingReview) {
                res.status(400).json({ message: 'Você já avaliou este produto' });
                return;
            }

            // 5. Adiciona a review
            const newReview = {
                user: userId,
                rating: Number(rating),
                comment: comment.trim(),
                images: images,
                createdAt: new Date()
            };

            if (!product.reviews) product.reviews = [];
            product.reviews.push(newReview as any);

            await product.save();

            // 6. Retorna o produto atualizado com a review populada
            const updatedProduct = await ProductModel.findById(productId).populate('reviews.user', 'name');
            
            res.status(201).json({ 
                message: 'Avaliação adicionada com sucesso',
                product: updatedProduct
            });
        } catch (error: any) {
            console.error('Erro ao adicionar avaliação:', error);
            res.status(500).json({ message: 'Erro ao adicionar avaliação', error: error.message });
        }
    };

    static getProductReviews: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id;
            // Popula o usuário para retornar o nome do avaliador
            const product = await ProductModel.findById(productId).populate('reviews.user', 'name');
            
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            res.status(200).json({ reviews: product.reviews || [] });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar avaliações', error: error.message });
        }
    };

    static checkUserCanReview: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id;
            const userId = (req as any).user.id;

            // 1. Verifica se o produto existe
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            // 2. Verifica se já avaliou
            const existingReview = product.reviews?.find(
                review => review.user.toString() === userId
            );

            if (existingReview) {
                res.status(200).json({ canReview: false, reason: 'Você já avaliou este produto' });
                return;
            }

            // 3. Verifica se comprou e recebeu
            const OrderModel = (await import('../models/OrderModel')).default;
            const userOrder = await OrderModel.findOne({
                user: userId,
                'items.productId': productId,
                status: 'Entregue'
            });

            if (!userOrder) {
                res.status(200).json({ 
                    canReview: false, 
                    reason: 'Você só pode avaliar produtos que já comprou e recebeu' 
                });
                return;
            }

            res.status(200).json({ canReview: true });
        } catch (error: any) {
            console.error('Erro ao verificar permissão de avaliação:', error);
            res.status(500).json({ message: 'Erro ao verificar permissão', error: error.message });
        }
    };

    static uploadImage = upload.single('imagem');
    static uploadReviewImages = reviewUpload.array('images', 5); // Permite até 5 imagens
    
    static deleteReview: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id;
            const userId = (req as any).user.id;

            console.log('deleteReview - productId:', productId);
            console.log('deleteReview - userId:', userId);

            const product = await ProductModel.findById(productId);
            if (!product) {
                console.log('deleteReview - Produto não encontrado');
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            console.log('deleteReview - Product reviews:', product.reviews?.map(r => ({ user: r.user.toString(), rating: r.rating })));

            // Encontra o índice da review do usuário
            const reviewIndex = product.reviews?.findIndex(
                review => review.user.toString() === userId
            );

            console.log('deleteReview - reviewIndex:', reviewIndex);

            if (reviewIndex === undefined || reviewIndex === -1) {
                console.log('deleteReview - Usuário não possui avaliação');
                res.status(404).json({ message: 'Você não possui uma avaliação para este produto' });
                return;
            }

            // Remove a review
            product.reviews!.splice(reviewIndex, 1);
            await product.save();

            console.log('deleteReview - Avaliação removida com sucesso');

            const updatedProduct = await ProductModel.findById(productId).populate('reviews.user', 'name');
            
            res.status(200).json({ 
                message: 'Avaliação removida com sucesso',
                product: updatedProduct
            });
        } catch (error: any) {
            console.error('Erro ao remover avaliação:', error);
            res.status(500).json({ message: 'Erro ao remover avaliação', error: error.message });
        }
    };
    
    static updateReview: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id;
            const userId = (req as any).user.id;
            const { rating, comment } = req.body;

            // Pega as imagens enviadas
            const newImages: string[] = [];
            if (req.files && Array.isArray(req.files)) {
                newImages.push(...req.files.map(file => path.join('public/images/reviews', file.filename)));
            } else if (req.file) {
                newImages.push(path.join('public/images/reviews', req.file.filename));
            }

            // Validação básica
            if (rating && (rating < 1 || rating > 5)) {
                res.status(400).json({ message: 'Nota deve ser entre 1 e 5' });
                return;
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            // Encontra a review do usuário
            const reviewIndex = product.reviews?.findIndex(
                review => review.user.toString() === userId
            );

            if (reviewIndex === undefined || reviewIndex === -1) {
                res.status(404).json({ message: 'Você não possui uma avaliação para este produto' });
                return;
            }

            // Atualiza os campos fornecidos
            if (rating) product.reviews![reviewIndex].rating = Number(rating);
            if (comment) product.reviews![reviewIndex].comment = comment.trim();
            
            // Se novas imagens foram enviadas, adiciona às existentes
            if (newImages.length > 0) {
                const currentImages = product.reviews![reviewIndex].images || [];
                product.reviews![reviewIndex].images = [...currentImages, ...newImages];
            }

            await product.save();

            const updatedProduct = await ProductModel.findById(productId).populate('reviews.user', 'name');
            
            res.status(200).json({ 
                message: 'Avaliação atualizada com sucesso',
                product: updatedProduct
            });
        } catch (error: any) {
            console.error('Erro ao atualizar avaliação:', error);
            res.status(500).json({ message: 'Erro ao atualizar avaliação', error: error.message });
        }
    };

    static deleteReviewImage: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id;
            const userId = (req as any).user.id;
            const { imageUrl } = req.body;

            if (!imageUrl) {
                res.status(400).json({ message: 'URL da imagem não fornecida' });
                return;
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            const reviewIndex = product.reviews?.findIndex(
                review => review.user.toString() === userId
            );

            if (reviewIndex === undefined || reviewIndex === -1) {
                res.status(404).json({ message: 'Você não possui uma avaliação para este produto' });
                return;
            }

            // Remove a imagem do array
            if (product.reviews![reviewIndex].images) {
                product.reviews![reviewIndex].images = product.reviews![reviewIndex].images!.filter(
                    img => img !== imageUrl
                );
            }

            await product.save();

            const updatedProduct = await ProductModel.findById(productId).populate('reviews.user', 'name');
            
            res.status(200).json({ 
                message: 'Imagem removida com sucesso',
                product: updatedProduct
            });
        } catch (error: any) {
            console.error('Erro ao remover imagem da avaliação:', error);
            res.status(500).json({ message: 'Erro ao remover imagem', error: error.message });
        }
    };
}

export default ProductController;