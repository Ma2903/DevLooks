import { Request, Response, RequestHandler } from 'express';
import Product from '../models/ProductModel'; // Importa a CLASSE Product
import multer from 'multer';
import path from 'path';

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: './public/images/products',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

class ProductController {
    // Adicionar um novo produto (MÉTODO CORRIGIDO)
    static addProduct: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { name, description, price, category, stock, sizes } = req.body;
            const image = req.file ? `images/products/${req.file.filename}` : '';
            
            const newProduct = await Product.create({ // Agora funciona!
                name,
                description,
                price,
                category,
                stock,
                image,
                sizes: sizes ? JSON.parse(sizes) : []
            });
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar produto', error });
        }
    };

    // Obter todos os produtos (MÉTODO CORRIGIDO)
    static getAllProducts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const products = await Product.findAll(); // Agora funciona!
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar produtos', error });
        }
    };

    // Obter um produto por ID (MÉTODO CORRIGIDO)
    static getProductById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await Product.findById(req.params.id); // Agora funciona!
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar produto', error });
        }
    };

    // Atualizar um produto (MÉTODO CORRIGIDO)
    static updateProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const productData = req.body;
            if (req.file) {
                productData.image = `images/products/${req.file.filename}`;
            }
            if(productData.sizes && typeof productData.sizes === 'string') {
                productData.sizes = JSON.parse(productData.sizes);
            }

            const updatedProduct = await Product.update(req.params.id, productData); // Agora funciona!
            if (!updatedProduct) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar produto', error });
        }
    };

    // Deletar um produto (MÉTODO CORRIGIDO)
    static deleteProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedProduct = await Product.delete(req.params.id); // Agora funciona!
            if (!deletedProduct) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json({ message: 'Produto deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar produto', error });
        }
    };

    // Middleware de upload
    static uploadImage = upload.single('image');
}

export default ProductController;