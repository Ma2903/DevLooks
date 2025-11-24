// server/index.ts

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirnameResolved = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirnameResolved, '../../.env') });

import { PORT } from './config/config';
import express from 'express';
import cors from 'cors';
import './config/database';

import usersRoutes from './routes/UserRoutes';
import productRoutes from './routes/ProductRoutes';
import couponRoutes from './routes/CouponRoutes';
import orderRoutes from './routes/OrderRoutes';
import cartRoutes from './routes/CartRoutes';
import adminRoutes from './routes/AdminRoutes';
import avatarRoutes from './routes/AvatarRoutes';
import shippingRoutes from './routes/ShippingRoutes';
import aiRoutes from './routes/AIRoutes';
import notificationRoutes from './routes/NotificationRoutes';
import wishlistRoutes from './routes/WishlistRoutes';
import paymentRoutes from './routes/PaymentRoutes';

const app = express();

const allowedOrigins = ['https://devlooks.vercel.app'];
const corsOptions = {
    origin: function (origin, callback) {
        // Permite sem origin (ex: curl, Postman) ou se está na lista
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// --- HEADERS DE SEGURANÇA ---
app.use((req, res, next) => {
    // Content Security Policy (CSP)
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://devlooks.vercel.app; style-src 'self' 'unsafe-inline' https://devlooks.vercel.app; img-src 'self' data: https://devlooks.vercel.app; font-src 'self' https://devlooks.vercel.app; connect-src 'self' https://devlooks.vercel.app; frame-ancestors 'none';");
    // Anti-clickjacking
    res.setHeader("X-Frame-Options", "DENY");
    // Anti-MIME sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Cache-Control para rotas sensíveis (ajuste conforme necessário)
    if (!req.url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|json|txt|xml)$/)) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
    }
    next();
});

const port = PORT;

// --- CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS ---
// Tenta múltiplos caminhos para garantir compatibilidade local e Render
const publicPath1 = path.join(__dirnameResolved, '../public'); // Para build local (dist/index.js → public)
const publicPath2 = path.join(__dirnameResolved, '../../public'); // Para estrutura alternativa
const publicPath3 = path.join(process.cwd(), 'public'); // Caminho absoluto da raiz do projeto

console.log('📁 Tentando servir arquivos estáticos de:');
console.log('   Path 1:', publicPath1);
console.log('   Path 2:', publicPath2);
console.log('   Path 3:', publicPath3);

// Serve arquivos estáticos de todos os caminhos possíveis
app.use(express.static(publicPath1));
app.use(express.static(publicPath2));
app.use(express.static(publicPath3));

// Rota adicional para servir imagens explicitamente
app.use('/images', express.static(path.join(publicPath1, 'images')));
app.use('/images', express.static(path.join(publicPath2, 'images')));
app.use('/images', express.static(path.join(publicPath3, 'images')));

// A rota do Avatar (mais específica) deve vir ANTES da rota de Usuários (mais geral)
app.use('/api', avatarRoutes);
app.use('/api', usersRoutes);

app.use('/api', productRoutes);
app.use('/api', couponRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api', adminRoutes);
app.use('/api', shippingRoutes);
app.use('/api', aiRoutes);
app.use('/api', notificationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);

const server = app.listen(port, () => {
    console.log(`✅ API Rodando em http://localhost:${port}`);
});

// Mantém o processo vivo
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${port} já está em uso`);
    } else {
        console.error('❌ Erro no servidor:', error);
    }
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Exceção não capturada:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rejeitada não tratada:', reason);
    process.exit(1);
});

// Impede que o processo termine imediatamente
process.on('SIGTERM', () => {
    console.log('🔴 Recebido SIGTERM, encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado graciosamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🔴 Recebido SIGINT (Ctrl+C), encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado graciosamente');
        process.exit(0);
    });
});