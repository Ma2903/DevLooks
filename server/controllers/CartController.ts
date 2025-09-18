// Ficheiro: server/controllers/CartController.ts

import { Request, Response, RequestHandler } from "express";
import UserModel from "../models/UserModel";

class CartController {
    // Obter o carrinho do utilizador logado
    static getCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await UserModel.findById(req.user.id);
            if (!user) {
                res.status(404).json({ message: "Utilizador não encontrado" });
                return;
            }
            res.status(200).json(user.cart);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar carrinho", error });
        }
    };

    // Adicionar um item ao carrinho
    static addToCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { productId, quantity, selectedSize, name, price, image } = req.body;
        
        try {
            const user = await UserModel.findById(req.user.id);
            if (!user) {
                res.status(404).json({ message: "Utilizador não encontrado" });
                return;
            }

            const itemIndex = user.cart.findIndex(item => 
                item.productId.toString() === productId && item.selectedSize === selectedSize
            );

            if (itemIndex > -1) {
                // Se o item já existe, atualiza a quantidade
                user.cart[itemIndex].quantity += quantity;
            } else {
                // CORREÇÃO APLICADA AQUI:
                // Passamos o `productId` como string diretamente. O Mongoose cuidará da conversão.
                user.cart.push({ productId, quantity, selectedSize, name, price, image });
            }

            await user.save();
            res.status(200).json(user.cart);

        } catch (error) {
            res.status(500).json({ message: "Erro ao adicionar ao carrinho", error });
        }
    };
    
    // Atualizar o carrinho inteiro (útil para mudanças de quantidade e remoções)
    static updateCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { cartItems } = req.body; // Espera receber o array completo do carrinho

        try {
            const user = await UserModel.findById(req.user.id);
            if (!user) {
                res.status(404).json({ message: "Utilizador não encontrado" });
                return;
            }
            
            user.cart = cartItems; // Substitui o carrinho antigo pelo novo
            await user.save();
            
            res.status(200).json(user.cart);

        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o carrinho", error });
        }
    };
}

export default CartController;