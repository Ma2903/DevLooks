// server/controllers/CartController.ts

import { Request, Response, RequestHandler } from "express";
import UserModel from "../models/UserModel";

class CartController {
    static getCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await UserModel.findById((req as any).user.id);
            if (!user) {
                res.status(200).json([]);
                return;
            }
            res.status(200).json(user.cart);
        } catch (error) {
            console.error("Erro ao buscar carrinho no backend:", error);
            res.status(500).json({ message: "Erro ao buscar carrinho", error });
        }
    };

    static addToCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { productId, quantity, selectedSize, name, price, image } = req.body;
        
        try {
            const user = await UserModel.findById((req as any).user.id);
            if (!user) {
                res.status(404).json({ message: "Utilizador não encontrado" });
                return;
            }

            // A lógica de migração foi removida daqui, pois agora está no UserController.

            const itemIndex = user.cart.findIndex(item => 
                item.productId.toString() === productId && item.selectedSize === selectedSize
            );

            if (itemIndex > -1) {
                user.cart[itemIndex].quantity += quantity;
            } else {
                user.cart.push({ productId, quantity, selectedSize, name, price, image });
            }

            await user.save();
            res.status(200).json(user.cart);

        } catch (error) {
            console.error('ERRO EM addToCart:', error); 
            res.status(500).json({ message: "Erro ao adicionar ao carrinho", error });
        }
    };
    
    static updateCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { cartItems } = req.body;
        try {
            const user = await UserModel.findById((req as any).user.id);
            if (!user) {
                res.status(404).json({ message: "Utilizador não encontrado" });
                return;
            }
            user.cart = cartItems;
            await user.save();
            res.status(200).json(user.cart);
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o carrinho", error });
        }
    };
}

export default CartController;