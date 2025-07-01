// server/validators/userValidator.ts

import { z } from 'zod';

// Define o schema de validação para a criação de um novo usuário
export const createUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "O nome é obrigatório." })
           .min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),

    email: z.string({ required_error: "O e-mail é obrigatório." })
            .email({ message: "Formato de e-mail inválido." }),

    cpf: z.string({ required_error: "O CPF é obrigatório." })
          .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "Formato de CPF inválido (use XXX.XXX.XXX-XX)." }),
    
    password: z.string({ required_error: "A senha é obrigatória." })
               .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),

    telephone: z.string({ required_error: "O telefone é obrigatório." }),
    
    // Adicione outras validações conforme necessário para os campos de endereço
    address: z.string({ required_error: "O endereço é obrigatório." }),
    number: z.string().optional(),
    complement: z.string().optional(),
    bairro: z.string().optional(),
    cep: z.string({ required_error: "O CEP é obrigatório." }),
    city: z.string({ required_error: "A cidade é obrigatória." }),
    state: z.string({ required_error: "O estado é obrigatório." }),
    country: z.string({ required_error: "O país é obrigatório." }),
  }),
});