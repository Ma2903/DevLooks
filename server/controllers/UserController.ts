import { Request, Response, RequestHandler } from "express";
import User from "../models/UserModel"; // Importamos a classe User

class UserController {
    static createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar usuário." });
        }
    };

    static getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuários." });
        }
    };

    static getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
            } else {
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuário." });
        }
    };

    static updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.update(req.params.id, req.body);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
            } else {
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar usuário." });
        }
    };

    static deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.delete(req.params.id);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
            } else {
                res.status(200).json({ message: "Usuário deletado com sucesso." });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar usuário." });
        }
    };
}

export default UserController;
