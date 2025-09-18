// Ficheiro: DevLooks-main/server/controllers/UserController.ts

import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel"; // Importa a CLASSE User restaurada
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

// Funções de criptografia (permanecem as mesmas)
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
            
            // Validação crucial para o erro do bcrypt
            if (!password) {
                res.status(400).json({ error: "O campo 'password' é obrigatório." });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Usa o método estático da sua classe User original
            const user = await User.create({
                ...req.body,
                password: hashedPassword,
            });

            const userResponse = user.toObject();
            delete userResponse.password;
            res.status(201).json(userResponse);
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(409).json({ error: "E-mail ou CPF já cadastrado." });
            } else {
                console.error("Erro ao criar usuário:", error);
                res.status(500).json({ error: "Ocorreu um erro inesperado ao criar o usuário." });
            }
        }
    };
    
    static login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            // Usa o método estático da sua classe
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

    // --- OS DEMAIS MÉTODOS SEGUEM O MESMO PADRÃO, USANDO A CLASSE User ---

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
                return;
            }
            res.status(200).json(user);
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
            const user = await User.update(req.params.id, req.body);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar usuário." });
        }
    };

    static deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.delete(req.params.id);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
            res.status(200).json({ message: "Usuário deletado com sucesso." });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar usuário." });
        }
    };

    static forgotPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;
        try {
            const user = await User.findByEmail(email);
            if (!user) {
                res.status(404).json({ error: "E-mail não encontrado." });
                return;
            }

            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const transporter = nodemailer.createTransport({
                host: MAIL_HOST,
                port: Number(MAIL_PORT),
                secure: false,
                auth: { user: MAIL_USER, pass: MAIL_PASS },
            });

            await transporter.sendMail({
                from: `DevLooks <${OWNER_EMAIL}>`,
                to: email,
                subject: "Código de Recuperação de Senha",
                html: `<p>Seu código para redefinir a senha é: <strong>${code}</strong></p>`,
            });

            res.status(200).json({
                message: "Instruções enviadas para o e-mail.",
                code: bcrypt.hashSync(code, 10),
                email: criptografar(user.email)
            });

        } catch (error: any) {
            res.status(500).json({ error: "Erro ao recuperar senha.", details: error.message });
        }
    };

    // Adicione este método dentro da classe UserController em server/controllers/UserController.ts

static saveAvatar: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { avatarUrl } = req.body;
    const userId = req.user?.id;

    if (!avatarUrl) {
        res.status(400).json({ error: "A URL do avatar é obrigatória." });
        return;
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado." });
            return;
        }

        // Verifica se o usuário já criou um avatar (se a regra de negócio exigir)
        if (user.hasCreatedAvatar) {
            res.status(403).json({ error: "Você já utilizou seu avatar gratuito." });
            return;
        }

        user.avatarUrl = avatarUrl;
        user.hasCreatedAvatar = true;
        await user.save();
        
        // Retorna o usuário atualizado (sem a senha) para atualizar o frontend
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({ message: "Avatar salvo com sucesso!", user: userResponse });
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar o avatar." });
    }
};

    static resetPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email, code, newPassword, hash } = req.body;
        try {
            const userEmail = descriptografar(email);
            const user = await User.findByEmail(userEmail);

            if (!user) {
                res.status(404).json({ error: "Link de recuperação inválido." });
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
        } catch (error: any) {
            res.status(500).json({ error: "Erro ao redefinir senha.", details: error.message });
        }
    };
}

export default UserController;