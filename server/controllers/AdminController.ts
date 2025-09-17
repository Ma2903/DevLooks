import { Request, Response, RequestHandler } from 'express';
import User from '../models/UserModel'; // Importa a CLASSE User
import Product from '../models/ProductModel'; // Importa a CLASSE Product
import Coupon from '../models/CouponModel';
import Order from '../models/OrderModel';

class AdminController {
    // Busca todos os usuários (MÉTODO CORRIGIDO)
    static getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await User.findAll(); // Agora funciona!
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuários', error });
        }
    };

    // Busca usuário por ID (MÉTODO CORRIGIDO)
    static getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.params.id); // Agora funciona!
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    };

    // Atualiza usuário (MÉTODO CORRIGIDO)
    static updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const updatedUser = await User.update(req.params.id, req.body); // Agora funciona!
            if (!updatedUser) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar usuário', error });
        }
    };

    // Deleta usuário (MÉTODO CORRIGIDO)
    static deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedUser = await User.delete(req.params.id); // Agora funciona!
            if (!deletedUser) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar usuário', error });
        }
    };

    // --- Métodos para Produtos (já devem estar corretos se seguirem o mesmo padrão) ---
    static getAllProducts: RequestHandler = async (req, res) => {
        try {
            const products = await Product.findAll(); // Usa o ProductModel corrigido
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar produtos' });
        }
    };
    
    // --- Métodos para Cupons ---
    static getAllCoupons: RequestHandler = async (req, res) => {
        try {
            const coupons = await Coupon.find();
            res.json(coupons);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar cupons' });
        }
    };

    // --- Métodos para Pedidos ---
    static getAllOrders: RequestHandler = async (req, res) => {
        try {
            const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name price');
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar pedidos' });
        }
    };
}

export default AdminController;