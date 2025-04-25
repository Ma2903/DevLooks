import { Request, Response, RequestHandler } from "express";
import Product from "../models/ProductModel";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/products/");
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        cb(null, `${Date.now()}-${originalName}`);
    },
});

const upload = multer({ storage });

class ProductController {
    static createProduct = [
        upload.single("imagem"),
        async (req: Request, res: Response): Promise<void> => {
            try {
                const { name, description, price, category, stock } = req.body;
                const image = req.file?.path;
                console.log("Imagem recebida:", image); // Log da imagem recebida

                if (!name || !description || !price || !category || !stock || !image) {
                    console.error("Erro: Campos obrigatórios ausentes.");
                    res.status(400).json({ error: "Todos os campos são obrigatórios." });
                    return;
                }

                const product = await Product.create({ name, description, price, category, stock, image });
                res.status(201).json(product);
            } catch (error) {
                console.error("Erro ao criar produto:", error.message); // Log detalhado do erro
                res.status(500).json({ error: "Erro ao criar produto." });
            }
        },
    ];

    static getAllProducts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const products = await Product.findAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar produtos." });
        }
    };

    static getProductById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                res.status(404).json({ error: "Produto não encontrado." });
            } else {
                res.status(200).json(product);
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar produto." });
        }
    };

    static updateProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!product) {
                res.status(404).json({ error: "Produto não encontrado." });
            } else {
                res.status(200).json(product);
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar produto." });
        }
    };

    static deleteProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) {
                res.status(404).json({ error: "Produto não encontrado." });
            } else {
                res.status(200).json({ message: "Produto deletado com sucesso." });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar produto." });
        }
    };
}

export default ProductController;