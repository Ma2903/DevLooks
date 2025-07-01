// server/middlewares/validationMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// Este middleware recebe um schema e o usa para validar a requisição
export const validate = (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Mapeia os erros para uma resposta mais amigável
        const errorMessages = error.errors.map(issue => ({
            message: `${issue.path.join('.')} - ${issue.message}`,
        }));
        res.status(400).json({ error: "Dados inválidos.", details: errorMessages });
      }
       res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };