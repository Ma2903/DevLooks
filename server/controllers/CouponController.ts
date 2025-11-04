// server/controllers/CouponController.ts

import { Request, Response, RequestHandler } from "express";
import Coupon from "../models/CouponModel";
import UserModel from "../models/UserModel"; // << IMPORTADO PARA VERIFICAR O USUÁRIO
import jwt from 'jsonwebtoken'; // << IMPORTADO PARA PEGAR O ID DO USUÁRIO

class CouponController {
    static createCoupon: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const newCoupon = new Coupon(req.body);
            await newCoupon.save();
            res.status(201).json(newCoupon);
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar cupom.", error });
        }
    };

    static getAllCoupons: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const coupons = await Coupon.find();
            res.status(200).json(coupons);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar cupons.", error });
        }
    };

    static getCouponById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const coupon = await Coupon.findById(req.params.id);
            if (!coupon) {
                res.status(404).json({ message: "Cupom não encontrado." });
                return;
            }
            res.status(200).json(coupon);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar cupom.", error });
        }
    };

    static updateCoupon: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedCoupon) {
                res.status(404).json({ message: "Cupom não encontrado." });
                return;
            }
            res.status(200).json(updatedCoupon);
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar cupom.", error });
        }
    };

    static deleteCoupon: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
            if (!deletedCoupon) {
                res.status(404).json({ message: "Cupom não encontrado." });
                return;
            }
            res.status(200).json({ message: "Cupom deletado com sucesso." });
        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar cupom.", error });
        }
    };
    
    static validateCoupon: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { code } = req.body;
            if (!code) {
                res.status(400).json({ message: "Código do cupom não fornecido." });
                return;
            }
            
            // Busca case-insensitive usando RegExp
            const coupon = await Coupon.findOne({ 
                code: { $regex: new RegExp('^' + code + '$', 'i') } 
            });

            if (!coupon || !coupon.is_active || new Date(coupon.expires_at) < new Date()) {
                res.status(404).json({ message: "Cupom inválido, expirado ou inativo." });
                return;
            }

            // << INÍCIO DA LÓGICA DE USO ÚNICO >>
            const token = req.headers.authorization?.split(' ')[1];
            // Removi a verificação de isSingleUse pois não existe no schema
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
                const user = await UserModel.findById(decoded.id);

                if (user && user.usedCoupons?.includes(coupon.code)) {
                    res.status(400).json({ message: "Este cupom já foi utilizado por você." });
                    return;
                }
            }
            // << FIM DA LÓGICA DE USO ÚNICO >>

            res.status(200).json(coupon);
        } catch (error) {
            res.status(500).json({ message: "Erro ao validar cupom.", error });
        }
    };
}

export default CouponController;