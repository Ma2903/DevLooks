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

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = PORT;

// --- CORREÇÃO APLICADA AQUI ---
// O caminho correto para a pasta 'public' é um nível acima ('../')
app.use(express.static(path.join(__dirnameResolved, '../public')));

// A rota do Avatar (mais específica) deve vir ANTES da rota de Usuários (mais geral)
app.use('/api', avatarRoutes);
app.use('/api', usersRoutes);

app.use('/api', productRoutes);
app.use('/api', couponRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api', adminRoutes);
app.use('/api', shippingRoutes);

app.listen(port, () => {
    console.log(`✅ API Rodando em http://localhost:${port}`);
});