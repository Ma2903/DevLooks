import { Request, Response, RequestHandler } from "express";
import Product from "../models/ProductModel";

class ProductController {
    static createProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar produto." });
        }
    };

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