// server/controllers/UserController.ts

import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';

// Importa a nova variável de ambiente
import {
    JWT_SECRET,
    CRYPTO_SECRET,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASS,
    OWNER_EMAIL
} from "../config/config";

function criptografar(dado: string): string {
    return encodeURIComponent(CryptoJS.AES.encrypt(dado, CRYPTO_SECRET).toString());
}

function descriptografar(dadoCriptografado: string): string {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(dadoCriptografado), CRYPTO_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
}

class UserController {

    static createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.create({
                ...req.body,
                password: hashedPassword,
            });
            const userResponse = user.toObject();
            delete userResponse.password;
            res.status(201).json(userResponse);
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ error: "E-mail ou CPF já cadastrado." });
            } else {
                console.error("Erro ao criar usuário:", error);
                res.status(500).json({ error: "Ocorreu um erro inesperado ao criar o usuário." });
            }
        }
    };

    static getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await User.findAll();
            const usersResponse = users.map(user => {
                const userObj = user.toObject();
                delete userObj.password;
                return userObj;
            });
            res.status(200).json(usersResponse);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuários." });
        }
    };

    static getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        let id = req.params.id || req.user.id;
        try {
            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
            } else {
                const userResponse = user.toObject();
                delete userResponse.password;
                res.status(200).json(userResponse);
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuário." });
        }
    };

    static updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userToUpdate = await User.findById(req.params.id);
            if (userToUpdate && userToUpdate.email === OWNER_EMAIL) {
                // CORREÇÃO: Removido o 'return'
                res.status(403).json({ error: "A conta do proprietário original não pode ser modificada." });
                return; // Usamos return aqui para parar a execução, mas sem retornar o valor de res.json()
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const user = await User.update(req.params.id, req.body);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
            } else {
                const userResponse = user.toObject();
                delete userResponse.password;
                res.status(200).json(userResponse);
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar usuário." });
        }
    };

    static deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userToDelete = await User.findById(req.params.id);
            if (userToDelete && userToDelete.email === OWNER_EMAIL) {
                // CORREÇÃO: Removido o 'return'
                res.status(403).json({ error: "A conta do proprietário original não pode ser apagada." });
                return; // Usamos return aqui para parar a execução
            }
            
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
    
    static login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);

            if (!user || !bcrypt.compareSync(password, user.password)) {
                res.status(401).json({ error: "Credenciais inválidas." });
                return;
            }
            
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "5h" });
            
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({ message: "Login bem-sucedido.", token, user: userResponse });
        } catch (error) {
            res.status(500).json({ error: "Erro ao fazer login." });
        }
    };

    static saveAvatar: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { avatarUrl } = req.body;

        if (!userId) {
            res.status(401).json({ error: "Usuário não autenticado." });
            return;
        }

        if (!avatarUrl) {
            res.status(400).json({ error: "URL do avatar é obrigatória." });
            return;
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }

            if (user.hasCreatedAvatar) {
                res.status(403).json({ error: "Você já criou seu avatar gratuito. Compre um novo slot na loja." });
                return;
            }

            const updatedUser = await User.update(userId, { 
                avatarUrl: avatarUrl,
                hasCreatedAvatar: true
            });

            if (!updatedUser) {
                res.status(404).json({ error: "Não foi possível atualizar o usuário." });
                return;
            }

            const userResponse = updatedUser.toObject();
            delete userResponse.password;

            res.status(200).json({ message: "Avatar salvo com sucesso.", user: userResponse });

        } catch (error) {
            console.error("Erro ao salvar avatar:", error);
            res.status(500).json({ error: "Erro interno ao salvar avatar." });
        }
    };

    static forgotPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const user = await User.findByEmail(email);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const transporter = nodemailer.createTransport({
                host: MAIL_HOST,
                port: parseInt(MAIL_PORT || '587'),
                secure: false,
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: '"DevLooks" <no-reply@devlooks.com>',
                to: email,
                subject: "Código de Recuperação de Senha",
                html: `<p>Seu código de recuperação de senha é: <strong>${code}</strong></p>`
            });
            
            res.status(200).json({ 
                message: "Instruções de recuperação de senha enviadas para o e-mail.", 
                code: bcrypt.hashSync(code, 10), 
                email: criptografar(user.email) 
            });

        } catch (error) {
            console.error("Erro em forgotPassword:", error);
            res.status(500).json({ error: "Erro ao recuperar senha.", errorMessage: error.message });
        }
    }

    static resetPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email, code, newPassword, hash } = req.body;
        try {
            const user = await User.findByEmail(descriptografar(email));
            if (!user) {
                res.status(404).json({ error: "Link de recuperação inválido ou expirado." });
                return;
            }

            if (bcrypt.compareSync(code, hash)) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
                await user.save();
                res.status(200).json({ message: "Senha atualizada com sucesso.", success: true });
            } else {
                res.status(400).json({ error: "Código de recuperação inválido." });
            }
        } catch (error) {
            console.error("Erro em resetPassword:", error);
            res.status(500).json({ error: "Erro ao redefinir senha.", errorMessage: error.message });
        }
    }
}

export default UserController;