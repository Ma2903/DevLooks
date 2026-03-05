// server/config/config.ts

import dotenv from 'dotenv';

// Esta linha é a mais importante: ela carrega as variáveis do .env
dotenv.config();

// --- Variáveis OBRIGATÓRIAS (o servidor NÃO deve iniciar sem elas) ---
function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        console.error(`❌ ERRO FATAL: A variável de ambiente ${name} não foi definida no .env`);
        process.exit(1);
    }
    return value;
}

export const JWT_SECRET = requireEnv('JWT_SECRET');
export const CRYPTO_SECRET = requireEnv('CRYPTO_SECRET');
export const MONGO_URI = requireEnv('MONGO_URI');
export const MERCADOPAGO_ACCESS_TOKEN = requireEnv('MERCADOPAGO_ACCESS_TOKEN');

// --- Variáveis opcionais ---
export const PORT = process.env.PORT || 3000;
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;
export const OWNER_EMAIL = process.env.OWNER_EMAIL;

// API Key do Google Gemini para funcionalidades de IA (opcional)
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// CEP de origem para cálculo de frete (Correios)
export const CORREIOS_CEP_ORIGEM = process.env.CORREIOS_CEP_ORIGEM || '19200009';