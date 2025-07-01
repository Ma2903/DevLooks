// server/config/config.ts

import dotenv from 'dotenv';

// Esta linha é a mais importante: ela carrega as variáveis do .env
dotenv.config();

// Agora, exportamos as variáveis para que outros arquivos possam usá-las
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_12345';
export const MONGO_URI = process.env.MONGO_URI || '';
export const PORT = process.env.PORT || 3000;
export const CRYPTO_SECRET = process.env.CRYPTO_SECRET || 'fallback_crypto_secret_67890';
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;