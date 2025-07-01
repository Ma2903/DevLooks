// server/controllers/ProductController.ts

import { Request, Response, RequestHandler } from "express";
import multer from "multer";
import { ProductFactory } from "../factories/ProductFactory";

const Product = ProductFactory.getModel();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        cb(null, `${Date.now()}-${originalName}`);
    },
});

const upload = multer({ storage });

class ProductController {
    // createProduct e outros métodos permanecem os mesmos
    static createProduct = [
        upload.single("imagem"),
        async (req: Request, res: Response): Promise<void> => {
            try {
                const { name, description, price, category, stock, sizes } = req.body;
                const image = req.file?.path;

                if (!name || !description || !price || !category || !stock || !image) {
                    res.status(400).json({ error: "Todos os campos, incluindo a imagem, são obrigatórios." });
                    return;
                }
                const productData = { name, description, price, category, stock, image, sizes: Array.isArray(sizes) ? sizes : [] };
                const product = await Product.create(productData);
                res.status(201).json(product);
            } catch (error) {
                console.error("Erro ao criar produto:", error);
                res.status(500).json({ error: "Erro ao criar produto." });
            }
        },
    ];

    static getAllProducts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar produtos." });
        }
    };

    static getProductById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) { res.status(404).json({ error: "Produto não encontrado." }); } 
            else { res.status(200).json(product); }
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar produto." });
        }
    };

    // MÉTODO DE ATUALIZAÇÃO CORRIGIDO PARA ACEITAR IMAGEM
    static updateProduct = [
        upload.single("imagem"), // <-- ADICIONADO AQUI
        async (req: Request, res: Response): Promise<void> => {
            try {
                const updateData = { ...req.body };

                // Se uma nova imagem foi enviada, adiciona o caminho dela aos dados de atualização
                if (req.file) {
                    updateData.image = req.file.path;
                }

                // Garante que 'sizes' seja um array
                if (updateData.sizes && !Array.isArray(updateData.sizes)) {
                    updateData.sizes = [updateData.sizes];
                } else if (!updateData.sizes) {
                    updateData.sizes = [];
                }

                const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
                
                if (!product) {
                    res.status(404).json({ error: "Produto não encontrado." });
                } else {
                    res.status(200).json(product);
                }
            } catch (error) {
                console.error("Erro ao atualizar produto:", error);
                res.status(500).json({ error: "Erro ao atualizar produto." });
            }
        }
    ];

    static deleteProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) { res.status(404).json({ error: "Produto não encontrado." }); } 
            else { res.status(200).json({ message: "Produto deletado com sucesso." }); }
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar produto." });
        }
    };
}

export default ProductController;