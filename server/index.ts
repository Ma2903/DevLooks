import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

// import productRoutes from './routes/productsRoutes';
import usersRoutes from './routes/UserRoutes';
import productRoutes from './routes/ProductRoutes';
import couponRoutes from './routes/CouponRoutes';

import connectDB from "./config/database";

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

connectDB.getInstance();
// app.use('/products',  productRoutes);
app.use('/api', usersRoutes);
app.use('/api', productRoutes);
app.use('/api', couponRoutes);

app.listen(port, () => {
    console.log(`API Rodando http://localhost:${port}`);
});

// npx tsx server/index.ts