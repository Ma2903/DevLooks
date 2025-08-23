// Ficheiro: DevLooks-main/server/controllers/OrderController.ts

import { Request, Response, RequestHandler } from "express";
import User from "../models/UserModel";

class OrderController {
    /**
     * Simula o processo de checkout.
     * Se o item "Slot de Avatar" for encontrado no carrinho,
     * atualiza o utilizador para permitir a criação de um novo avatar.
     */
    static checkout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { cartItems } = req.body; // Recebe os itens do carrinho do front-end

        if (!userId) {
            res.status(401).json({ error: "Utilizador não autenticado." });
            return;
        }

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            res.status(400).json({ error: "O carrinho de compras está vazio." });
            return;
        }

        try {
            // Verifica se o "Slot de Avatar" está entre os itens comprados, usando a categoria "avatares"
            const hasPurchasedAvatarSlot = cartItems.some(item => item.category === 'avatares');

            if (hasPurchasedAvatarSlot) {
                const user = await User.findById(userId);
                if (user) {
                    // Reseta a flag, permitindo que o utilizador crie/edite o avatar novamente
                    user.hasCreatedAvatar = false;
                    await user.save();
                }
            }

            // Para o TP3, a simulação e o desbloqueio do avatar são suficientes.
            // Num projeto real, aqui seria criado um registo do pedido na base de dados, processaria o pagamento, etc.

            res.status(200).json({ message: "Compra finalizada com sucesso! O seu slot de avatar foi liberado." });

        } catch (error) {
            console.error("Erro no checkout:", error);
            res.status(500).json({ error: "Erro interno ao processar a compra." });
        }
    };
}

export default OrderController;