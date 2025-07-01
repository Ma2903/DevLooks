// server/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config"; // Importa a chave do nosso ponto central

// A interface global permanece a mesma
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    if (!token) {
        res.status(401).json({ message: "Token not provided" });
        return;
    }

    try {
        // Usa a JWT_SECRET importada para verificar
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // Simplificamos o tratamento de erro
        res.status(403).json({ message: "Invalid token" });
    }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: "Acesso negado. Token não encontrado ou inválido." });
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(403).json({ message: "Acesso proibido. Você não tem permissão de administrador." });
        return;
    }
    
    next();
};