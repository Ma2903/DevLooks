// server/controllers/AvatarController.ts

import { Request, Response, RequestHandler } from "express";
import UserModel from "../models/UserModel";
import jwt from 'jsonwebtoken';

class AvatarController {
    // Método para salvar e definir um avatar
    static saveAvatar: RequestHandler = async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
            const userId = decoded.id;
            const { avatarUrl } = req.body;

            if (!avatarUrl) {
                return res.status(400).json({ message: "URL do avatar não fornecida." });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            // Verifica se o avatar já existe na galeria para não gastar um passe à toa
            const isExistingAvatar = user.savedAvatars?.includes(avatarUrl);

            // Se for um avatar novo e o usuário não tiver passes, retorna erro
            // O !user.hasCreatedAvatar permite que o primeiro seja gratuito
            if (!isExistingAvatar && user.hasCreatedAvatar && (!user.avatarPasses || user.avatarPasses <= 0)) {
                return res.status(403).json({ message: "Você não tem passes para salvar um novo avatar. Adquira um na loja!" });
            }

            // Se for um avatar novo, adiciona à galeria e gasta um passe (se não for o primeiro)
            if (!isExistingAvatar) {
                user.savedAvatars?.push(avatarUrl);
                if (user.hasCreatedAvatar) {
                    user.avatarPasses = (user.avatarPasses || 0) - 1;
                }
            }
            
            user.avatarUrl = avatarUrl;
            user.hasCreatedAvatar = true;

            await user.save();
            
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({ message: "Avatar definido com sucesso!", user: userResponse });
        } catch (error: any) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Token inválido' });
            }
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    };

    // Método para deletar um avatar da galeria
    static deleteAvatar: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token não fornecido' });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
            const userId = decoded.id;
            const { avatarUrl } = req.body;

            if (!avatarUrl) {
                res.status(400).json({ message: "URL do avatar não fornecida." });
                return;
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }

            if (user.avatarUrl === avatarUrl) {
                res.status(400).json({ message: "Você não pode excluir seu avatar de perfil ativo. Troque de avatar antes de excluir." });
                return;
            }

            user.savedAvatars = user.savedAvatars?.filter(url => url !== avatarUrl);
            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({ message: "Avatar excluído com sucesso.", user: userResponse });
        } catch (error: any) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: 'Token inválido' });
                return;
            }
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    };
}

export default AvatarController;