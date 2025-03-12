import { Router, Request, Response } from "express";

import ProductsController from '../controllers/productsController';

const controller = new ProductsController();

const router = Router();

router.get('/', (req: Request, res: Response) => {controller.getProducts(req, res)});
router.get('/:id', (req: Request, res: Response) => {controller.getProductById(req, res)});
router.post('/', (req: Request, res: Response) => {controller.createProduct(req, res)});
router.put('/:id', (req: Request, res: Response) => {controller.updateProduct(req, res)});
router.delete('/:id', (req: Request, res: Response) => {controller.deleteProduct(req, res)});

export default router;