// Ficheiro: server/controllers/AdminController.ts
import { Request, Response, RequestHandler } from 'express';
import UserModel from '../models/UserModel';
import ProductModel from '../models/ProductModel';
import CouponModel from '../models/CouponModel';
import OrderModel from '../models/OrderModel';

class AdminController {
    static getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await UserModel.find().select('-password');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuários', error });
        }
    };

    static getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await UserModel.findById(req.params.id).select('-password');
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    };

    static updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
            if (!updatedUser) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar usuário', error });
        }
    };

    static deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar usuário', error });
        }
    };

    static getAllProducts: RequestHandler = async (req, res) => {
        try {
            const products = await ProductModel.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar produtos' });
        }
    };
    
    static getAllCoupons: RequestHandler = async (req, res) => {
        try {
            const coupons = await CouponModel.find();
            res.json(coupons);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar cupons' });
        }
    };

    static getAllOrders: RequestHandler = async (req, res) => {
        try {
            const orders = await OrderModel.find().populate('user', 'name email');
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar pedidos' });
        }
    };

    static extractData: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await UserModel.find().select('-password');
            const products = await ProductModel.find();
            res.status(200).json({
                message: "Dados extraídos com sucesso!",
                totalUsers: users.length,
                totalProducts: products.length,
                users,
                products
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao extrair dados', error });
        }
    };
}

export default AdminController;