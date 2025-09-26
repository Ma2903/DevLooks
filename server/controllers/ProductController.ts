// Ficheiro: server/controllers/ProductController.ts
import { Request, Response, RequestHandler } from 'express';
import ProductModel from '../models/ProductModel';
import Order from '../models/OrderModel';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './public/images/products',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

class ProductController {
    static addProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, description, price, category, stock, sizes } = req.body;
            const image = req.file ? path.join('images/products', req.file.filename) : '';
            
            const newProduct = await ProductModel.create({
                name, description, price, category, stock, image,
                sizes: sizes ? (Array.isArray(sizes) ? sizes : [sizes]) : []
            });
            res.status(201).json(newProduct);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao adicionar produto', error: error.message });
        }
    };

    static getAllProducts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
                productData.image = path.join('images/products', req.file.filename);
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

    // CORREÇÃO APLICADA AQUI
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
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails',
              },
            },
            { $unwind: '$productDetails' },
            {
              $replaceRoot: { newRoot: '$productDetails' }
            },
          ]);
      
          res.status(200).json(bestSellingProducts);
        } catch (error: any) {
          res.status(500).json({ message: 'Erro ao buscar produtos mais vendidos', error: error.message });
        }
    };

    static uploadImage = upload.single('imagem');
}

export default ProductController;