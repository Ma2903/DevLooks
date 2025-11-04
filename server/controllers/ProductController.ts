// Ficheiro: server/controllers/ProductController.ts
import { Request, Response, RequestHandler } from 'express';
import ProductModel from '../models/ProductModel';
import Order from '../models/OrderModel';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './public/images/products',
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

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
          const bestSellingProducts = await Order.aggregate([
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
            const { rating, comment, images } = req.body;

            // Validação
            if (!rating || rating < 1 || rating > 5) {
                res.status(400).json({ message: 'Nota deve ser entre 1 e 5' });
                return;
            }
            if (!comment || comment.trim() === '') {
                res.status(400).json({ message: 'Comentário é obrigatório' });
                return;
            }

            // Verifica se o produto existe
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            // Verificação de segurança: usuário comprou e recebeu o produto?
            const userOrder = await Order.findOne({
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

            // Verifica se o usuário já avaliou este produto
            const existingReview = product.reviews?.find(
                review => review.user.toString() === userId
            );

            if (existingReview) {
                res.status(400).json({ message: 'Você já avaliou este produto' });
                return;
            }

            // Adiciona a review
            if (!product.reviews) product.reviews = [];
            product.reviews.push({
                user: userId as any,
                rating: Number(rating),
                comment: comment.trim(),
                images: images || [],
                createdAt: new Date()
            });

            await product.save();

            // Popula o usuário para retornar info completa
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

            // Verifica se o produto existe
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            // Verifica se já avaliou
            const existingReview = product.reviews?.find(
                review => review.user.toString() === userId
            );

            if (existingReview) {
                res.status(200).json({ canReview: false, reason: 'Você já avaliou este produto' });
                return;
            }

            // Verifica se comprou e recebeu
            const userOrder = await Order.findOne({
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
}

export default ProductController;