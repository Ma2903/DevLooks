// Ficheiro: server/index.ts

import { PORT } from './config/config';
import express from 'express';
import cors from 'cors';
import './config/database'; 
import path from 'path'; 
import { fileURLToPath } from 'url';

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

const __filename = fileURLToPath(import.meta.url);
// A CORREÇÃO ESTÁ AQUI 👇: Adicionado '__' antes de 'dirname'
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = PORT;

// A linha abaixo agora funcionará corretamente
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
