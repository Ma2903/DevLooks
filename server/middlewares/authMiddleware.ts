// server/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Adicione este log para depuração
            console.log('Verificando token com o segredo:', JWT_SECRET);

            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error("ERRO ao verificar o token:", error);
            res.status(401).json({ message: "Não autorizado, token inválido." });
        }
    } else {
        res.status(401).json({ message: "Não autorizado, token não fornecido." });
    }
};

// A sua função verifyAdmin está correta e não precisa de alterações
export const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: "Acesso negado. Token não encontrado ou inválido." });
        return;
    }

    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
        res.status(403).json({ message: "Acesso proibido. Você não tem permissão de administrador." });
        return;
    }
    
    next();
};

// A sua função verifyOwner também está correta
export const verifyOwner = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: "Acesso negado. Token não encontrado ou inválido." });
        return;
    }

    if (req.user.role !== 'owner') {
        res.status(403).json({ message: "Acesso proibido. Apenas o proprietário pode realizar esta ação." });
        return;
    }
    
    next();
};