import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/UserModel";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';

import {
    JWT_SECRET,
    CRYPTO_SECRET,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASS,
    OWNER_EMAIL
} from "../config/config";

const generateToken = (user: IUser): string => {
    // Adicione este log para depuração
    console.log('Assinando token com o segredo:', JWT_SECRET);
    
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "5h" });
};

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
            const user = await UserModel.create(req.body);
            const userResponse = user.toObject();
            delete userResponse.password;
            res.status(201).json(userResponse);
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(409).json({ error: "E-mail ou CPF já cadastrado." });
            } else {
                res.status(500).json({ error: "Ocorreu um erro inesperado." });
            }
        }
    };

    static login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            // ---- CORREÇÃO DEFINITIVA APLICADA AQUI ----
            if (!email || !password) {
                res.status(400).json({ error: "E-mail e senha são obrigatórios." });
                return;
            }

            const user = await UserModel.findOne({ email: email.toLowerCase() });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                res.status(401).json({ error: "Credenciais inválidas." });
                return;
            }
            
            const token = generateToken(user);
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({ message: "Login bem-sucedido.", token, user: userResponse });
        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ error: "Erro interno ao tentar fazer login." });
        }
    };
    
    static getMe: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await UserModel.findById(req.user.id).select('-password');
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar dados do usuário." });
        }
    };

    static getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await UserModel.find().select('-password');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuários." });
        }
    };

    static getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await UserModel.findById(req.params.id).select('-password');
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
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
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
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
            } else {
                res.status(200).json({ message: "Usuário deletado com sucesso." });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar usuário." });
        }
    };

    static saveAvatar: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { avatarUrl } = req.body;
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
            if (user.hasCreatedAvatar) {
                res.status(403).json({ error: "Você já criou seu avatar gratuito." });
                return;
            }
            user.avatarUrl = avatarUrl;
            user.hasCreatedAvatar = true;
            await user.save();
            const userResponse = user.toObject();
            delete userResponse.password;
            res.status(200).json({ message: "Avatar salvo com sucesso.", user: userResponse });
        } catch (error) {
            res.status(500).json({ error: "Erro interno ao salvar avatar." });
        }
    };

    static forgotPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email });
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const transporter = nodemailer.createTransport({
                host: MAIL_HOST,
                port: parseInt(MAIL_PORT || '587'),
                secure: false,
                auth: { user: MAIL_USER, pass: MAIL_PASS },
            });
            await transporter.sendMail({
                from: '"DevLooks" <no-reply@devlooks.com>',
                to: email,
                subject: "Código de Recuperação de Senha",
                html: `<p>Seu código de recuperação de senha é: <strong>${code}</strong></p>`
            });
            res.status(200).json({
                message: "Instruções de recuperação enviadas.",
                code: bcrypt.hashSync(code, 10),
                email: criptografar(user.email)
            });
        } catch (error) {
            res.status(500).json({ error: "Erro ao recuperar senha." });
        }
    }

    static resetPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email, code, newPassword, hash } = req.body;
        try {
            const user = await UserModel.findOne({ email: descriptografar(email) });
            if (!user) {
                res.status(404).json({ error: "Link de recuperação inválido." });
                return;
            }
            if (bcrypt.compareSync(code, hash)) {
                user.password = newPassword;
                await user.save();
                res.status(200).json({ message: "Senha atualizada com sucesso.", success: true });
            } else {
                res.status(400).json({ error: "Código de recuperação inválido." });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao redefinir senha." });
        }
    }
}

export default UserController;