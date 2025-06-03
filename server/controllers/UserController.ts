import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
// import User from "../models/UserModel"; // Importamos a classe User
import { UserFactory } from "../factories/UserFactory";
import nodemailer from "nodemailer"
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';

const User = UserFactory.getModel()

const chaveSecreta = 'abacaxi123'; // Chave secreta para criptografia e descriptografia
// Função para criptografar
function criptografar(dado: string): string {
    return encodeURIComponent(CryptoJS.AES.encrypt(dado, chaveSecreta).toString());
  }
  
  // Função para descriptografar
  function descriptografar(dadoCriptografado: string): string {
    const bytes = CryptoJS.AES.decrypt(dadoCriptografado, chaveSecreta);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  

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
        let id = req.params.id || req.user.id;
        try {
            const user = await User.findById(id);
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

    static login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Certifique-se de que a chave está configurada
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            if (!user || user.password !== password) {
                res.status(401).json({ error: "Credenciais inválidas." });
            } else {
                const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "5h" });
                res.status(200).json({ message: "Login bem-sucedido.", token: token });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao fazer login." });
        }
    };

    static forgotPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const user = await User.findByEmail(email);
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
            } else {
                const code = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um código de 6 dígitos
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com", // Substitua pelo seu servidor SMTP
                    port: 587, // Porta do servidor SMTP para conexão segura
                    secure: false, // false para 587 (SMTP seguro com STARTTLS)
                    auth: {
                        user: "godlolpro32@gmail.com", // Seu usuário SMTP
                        pass: "ieil edjw hbcu tnqc", // Sua senha SMTP
                    },
                });

                await transporter.sendMail({
                    from: "no-reply@devlooks.com", // your email
                    to: "godlolpro32@gmail.com", // the email address you want to send an email to
                    subject: "Código de Recuperação de Senha", // The title or subject of the email
                    html: `<p>Seu código de recuperação de senha é: <strong>${code}</strong></p>` // Sending the code as HTML
                });
                res.status(200).json({ message: "Instruções de recuperação de senha enviadas para o e-mail.", code:bcrypt.hashSync(code, 10) , email:criptografar(user.email) });
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao recuperar senha." , errorMessage: error.message });
        }
    }
    static resetPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { email, code, newPassword, hash } = req.body;
        try {
            const user = await User.findByEmail(descriptografar(email));
            if (!user) {
                res.status(404).json({ error: "Usuário não encontrado." });
            } else {
                if (bcrypt.compareSync(code, hash)) {
                    user.password = newPassword; // Atualiza a senha do usuário
                    await user.save(); // Salva as alterações no banco de dados
                    res.status(200).json({ message: "Senha atualizada com sucesso.",success: true });
                } else {
                    res.status(400).json({ error: "Código de recuperação inválido." });
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao redefinir senha." , errorMessage: error.message });
        }
    }
}

export default UserController;
