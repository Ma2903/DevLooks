
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

import jwt from "jsonwebtoken";



export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {

    let token = req.headers.authorization;
    // Check if the token is provided in the Authorization header
    if (token && token.startsWith("Bearer ")) {
        // Remove "Bearer " prefix from the token
        token = token.slice(7, token.length);
    }



    if (!token) {

        res.status(401).json({ message: "Token not provided" });

        return;

    }

    // Token verification logic using JWT

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token data to the request object
        var isValid = true;
    } catch (err) {
        var isValid = false;
    }

    if (!isValid) {

        res.status(403).json({ message: "Invalid token" });

        return;

    }

    next();

};
