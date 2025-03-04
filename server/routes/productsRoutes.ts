import { Router, Request, Response } from "express";

import ProductsController from '../controllers/productsController';

const controller = new ProductsController();

const router = Router();

router.get('/', (req: Request, res: Response) => {controller.getProducts(req, res)});
router.get('/products/:id', (req: Request, res: Response) => {});
router.post('/products', (req: Request, res: Response) => {});
router.put('/products/:id', (req: Request, res: Response) => {});
router.delete('/products/:id', (req: Request, res: Response) => {});

export default router;