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

            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error: any) {
            // Tratamento específico para token expirado
            if (error.name === 'TokenExpiredError') {
                console.warn("⚠️  Token expirado. Usuário precisa fazer login novamente.");
                res.status(401).json({ 
                    message: "Sua sessão expirou. Por favor, faça login novamente.",
                    expired: true 
                });
                return;
            }
            
            // Outros erros de token
            console.error("❌ Erro ao verificar token:", error.message);
            res.status(401).json({ 
                message: "Token inválido. Por favor, faça login novamente.",
                expired: false 
            });
        }
    } else {
        res.status(401).json({ message: "Token não fornecido. Por favor, faça login." });
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