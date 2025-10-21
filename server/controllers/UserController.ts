// server/controllers/UserController.ts

import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/UserModel";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';

import {
    JWT_SECRET, CRYPTO_SECRET, MAIL_HOST,
    MAIL_PORT, MAIL_USER, MAIL_PASS
} from "../config/config";

const generateToken = (user: IUser): string => {
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
            const { name, email, cpf, password, telephone, address, number, complement, bairro, cep, city, state, country } = req.body;

            // --- CORREÇÃO DEFINITIVA ---
            // Monta o objeto de endereço no formato que o UserModel espera.
            const addressObject = {
                street: address,
                number: number,
                complement: complement,
                neighborhood: bairro,
                cep: cep,
                city: city,
                state: state,
            };

            // Cria o payload final com o objeto de endereço aninhado.
            const newUserPayload = {
                name,
                email,
                cpf,
                password,
                telephone,
                address: addressObject, // Passa o objeto aninhado
                country,
            };

            const user = await UserModel.create(newUserPayload);
            const { password: _, ...userResponse } = user.toObject();
            res.status(201).json(userResponse);
            
        } catch (error: any) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                res.status(409).json({ message: `O ${field} informado já está em uso.` });
            } else {
                console.error("Erro detalhado ao criar usuário:", error);
                res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
            }
        }
    };

    static login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
            if (!userDoc || !(await bcrypt.compare(password, userDoc.password))) {
                res.status(401).json({ error: "Credenciais inválidas." });
                return;
            }
            const token = generateToken(userDoc);
            const { password: _, ...userResponse } = userDoc.toObject();
            res.status(200).json({ message: "Login bem-sucedido.", token, user: userResponse });
        } catch (error) {
            res.status(500).json({ error: "Erro interno ao tentar fazer login." });
        }
    };

    static getMe: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await UserModel.findById((req as any).user.id).select('-password');
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
            if (!user.address || typeof user.address !== 'object') {
                (user as any).address = {};
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar dados do usuário." });
        }
    };

    static updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
            if (!updatedUser) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error("ERRO DETALHADO AO ATUALIZAR USUÁRIO:", error);
            res.status(500).json({ error: "Erro ao atualizar usuário." });
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
    static deleteSelf: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const user = await UserModel.findByIdAndDelete(userId);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
            res.status(200).json({ message: "Sua conta foi deletada com sucesso." });
        } catch (error) {
            console.error("Erro ao deletar o próprio usuário:", error);
            res.status(500).json({ error: "Erro ao deletar usuário." });
        }
    };
    static deleteSavedAvatar: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
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
                res.status(400).json({ message: "Você não pode excluir seu avatar de perfil ativo." });
                return;
            }
            await UserModel.updateOne(
                { _id: userId },
                { $pull: { savedAvatars: avatarUrl } }
            );
            const updatedUser = await UserModel.findById(userId).select('-password');
            res.status(200).json({ message: "Avatar excluído com sucesso.", user: updatedUser });
        } catch (error) {
            console.error("Erro ao deletar avatar salvo:", error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    };
}

export default UserController;