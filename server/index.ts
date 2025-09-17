// Ficheiro: DevLooks-main/server/index.ts

import { PORT } from './config/config';
import express from 'express';
import cors from 'cors';
import connectDB from "./config/database";

// Importa as rotas
import usersRoutes from './routes/UserRoutes';
import productRoutes from './routes/ProductRoutes';
import couponRoutes from './routes/CouponRoutes';
import orderRoutes from './routes/OrderRoutes';
import cartRoutes from './routes/CartRoutes';
import adminRoutes from './routes/AdminRoutes';

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB.getInstance();

const port = PORT;

// Configura as rotas da API
app.use('/api', usersRoutes);
app.use('/api', productRoutes);
app.use('/api', couponRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api', adminRoutes); USAR A NOVA ROTA

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`✅ API Rodando em http://localhost:${port}`);
});