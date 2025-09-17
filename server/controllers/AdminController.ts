import {Request , Response, RequestHandler} from "express";
import User from '../models/UserModel';
import Coupon from "../models/CouponModel";
import Product from "../models/ProductModel";
import { ProductFactory } from "../factories/ProductFactory";


class AdminController {
    static extractData: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            // Buscar todos os dados do banco
            const users = await User.findAll();
            const coupons = await Coupon.find();
            const products = await Product.find();

            // Criar objeto com todos os dados
            const exportData = {
                exportDate: new Date().toISOString(),
                totalUsers: users.length,
                totalCoupons: coupons.length,
                totalProducts: products.length,
                data: {
                    users: users,
                    coupons: coupons,
                    products: products
                }
            };

            // Configurar headers para download do arquivo
            const filename = `devlooks_backup_${new Date().toISOString().split('T')[0]}.json`;
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Cache-Control', 'no-cache');
            
            // Enviar o arquivo JSON
            res.json(exportData);
        } catch (error) {
            console.error('Erro ao extrair dados:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor ao extrair dados',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };
}

export default AdminController;