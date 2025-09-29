// Ficheiro: server/index.ts

import { PORT } from './config/config';
import express from 'express';
import cors from 'cors';
import './config/database'; 
import path from 'path'; // <<---- IMPORTE O 'path'
// Remova a importação de fileURLToPath pois não será mais usada

// Importa as rotas
import usersRoutes from './routes/UserRoutes';
import productRoutes from './routes/ProductRoutes';
import couponRoutes from './routes/CouponRoutes';
import orderRoutes from './routes/OrderRoutes';
import cartRoutes from './routes/CartRoutes';
import adminRoutes from './routes/AdminRoutes';
import avatarRoutes from './routes/AvatarRoutes';

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = PORT;

// Essas linhas garantem que o Express encontre a pasta 'public' corretamente
// Use as variáveis globais do Node.js (__dirname e __filename)
app.use(express.static(path.join(__dirname, '../public')));


// Configura as rotas da API
app.use('/api', usersRoutes);
app.use('/api', productRoutes);
app.use('/api', couponRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api', adminRoutes);
app.use('/api', avatarRoutes);

app.listen(port, () => {
    console.log(`✅ API Rodando em http://localhost:${port}`);
});