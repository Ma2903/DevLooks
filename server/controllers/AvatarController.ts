// server/controllers/AvatarController.ts

import { Request, Response, RequestHandler } from "express";
import UserModel from "../models/UserModel";
import jwt from 'jsonwebtoken';
import axios from 'axios'; // Importe o axios para usar no proxy
import { JWT_SECRET } from '../config/config';

class AvatarController {

    static proxyAvatar: RequestHandler = async (req: Request, res: Response) => {
        const { url } = req.query;
        if (typeof url !== 'string') {
            return res.status(400).send('URL do avatar não fornecida.');
        }
        try {
            const response = await axios.get(url, { responseType: 'stream' });
            response.data.pipe(res);
        } catch (error) {
            console.error("Erro no proxy do avatar:", error);
            res.status(500).send('Erro ao buscar a imagem do avatar.');
        }
    };

    static saveAvatar: RequestHandler = async (req: Request, res: Response) => {
        // --- CORREÇÃO APLICADA AQUI ---
        // Pega o ID do usuário diretamente do token decodificado pelo middleware 'verifyToken'
        const userId = (req as any).user.id;
        const { avatarUrl } = req.body;

        try {
            if (!avatarUrl) {
                return res.status(400).json({ message: "URL do avatar não fornecida." });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            const isExistingAvatar = user.savedAvatars?.includes(avatarUrl);

            if (!isExistingAvatar && user.hasCreatedAvatar && (!user.avatarPasses || user.avatarPasses <= 0)) {
                return res.status(403).json({ message: "Você não tem passes para salvar um novo avatar. Adquira um na loja!" });
            }

            if (!isExistingAvatar) {
                if (!user.savedAvatars) {
                    user.savedAvatars = [];
                }
                user.savedAvatars.push(avatarUrl);
                if (user.hasCreatedAvatar) {
                    user.avatarPasses = (user.avatarPasses || 0) - 1;
                }
            }

            user.avatarUrl = avatarUrl;
            user.hasCreatedAvatar = true;

            await user.save();

            const { password, ...userResponse } = user.toObject();

            res.status(200).json({ message: "Avatar definido com sucesso!", user: userResponse });
        } catch (error: any) {
            console.error("ERRO EM saveAvatar:", error);
            res.status(500).json({ message: 'Erro interno do servidor ao salvar avatar' });
        }
    };

    static deleteAvatar: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token não fornecido' });
            return;
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
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
            const { password, ...responseWithoutPassword } = userResponse;

            res.status(200).json({ message: "Avatar excluído com sucesso.", user: responseWithoutPassword });
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