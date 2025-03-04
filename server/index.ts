import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import productRoutes from './routes/productsRoutes';

const app = express();
dotenv.config();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

interface Produto {
    id: number;
    name: string;
    image: string;
    price: number;
    category: string;
}

app.use('/products',  productRoutes);

app.listen(port, () => {
    console.log(`API Rodando http://localhost:${port}`);
});

// npx tsx server/index.ts