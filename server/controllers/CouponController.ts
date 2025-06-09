import { Request, Response, RequestHandler } from "express";
import Coupon from "../models/CouponModel";

class CouponController {
    // Criar um novo cupom
    static createCoupon: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { code, discountType, discountValue, expirationDate, isActive } = req.body;

            // Validação básica
            if (!code || !discountType || !discountValue || !expirationDate) {
                res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
                return;
            }

            const coupon = await Coupon.create({
                code,
                discountType,
                discountValue,
                expirationDate,
                isActive: isActive ?? true, // Define como ativo por padrão
            });

            res.status(201).json(coupon);
        } catch (error) {
            console.error("Erro ao criar cupom:", error);
            res.status(500).json({ error: "Erro ao criar cupom." });
        }
    };

    // Obter todos os cupons
    static getAllCoupons: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const coupons = await Coupon.find(); // Corrigido para usar o método padrão do Mongoose
            res.status(200).json(coupons);
        } catch (error) {
            console.error("Erro ao buscar cupons:", error);
            res.status(500).json({ error: "Erro ao buscar cupons." });
        }
    };

    // Obter um cupom pelo ID
    static getCouponById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const coupon = await Coupon.findById(req.params.id); // Corrigido para usar o método padrão do Mongoose

            if (!coupon) {
                res.status(404).json({ error: "Cupom não encontrado." });
                return;
            }

            res.status(200).json(coupon);
        } catch (error) {
            console.error("Erro ao buscar cupom:", error);
            res.status(500).json({ error: "Erro ao buscar cupom." });
        }
    };

    // Atualizar um cupom
    static updateCoupon: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { code, discountType, discountValue, expirationDate, isActive } = req.body;

            // Validação básica
            if (!code || !discountType || !discountValue || !expirationDate) {
                res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
                return;
            }

            const coupon = await Coupon.findByIdAndUpdate(
                req.params.id,
                {
                    code,
                    discountType,
                    discountValue,
                    expirationDate,
                    isActive,
                },
                { new: true } // Retorna o documento atualizado
            );

            if (!coupon) {
                res.status(404).json({ error: "Cupom não encontrado." });
                return;
            }

            res.status(200).json(coupon);
        } catch (error) {
            console.error("Erro ao atualizar cupom:", error);
            res.status(500).json({ error: "Erro ao atualizar cupom." });
        }
    };

    // Deletar um cupom
    static deleteCoupon: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const coupon = await Coupon.findByIdAndDelete(req.params.id); // Corrigido para usar o método padrão do Mongoose

            if (!coupon) {
                res.status(404).json({ error: "Cupom não encontrado." });
                return;
            }

            res.status(200).json({ message: "Cupom deletado com sucesso." });
        } catch (error) {
            console.error("Erro ao deletar cupom:", error);
            res.status(500).json({ error: "Erro ao deletar cupom." });
        }
    };

    // Validar um cupom no carrinho
    static validateCoupon: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { code } = req.body;

            if (!code) {
                res.status(400).json({ error: "O código do cupom é obrigatório." });
                return;
            }

            const coupon = await Coupon.findOne({ code: code.toUpperCase() }); // Corrigido para usar o método padrão do Mongoose

            if (!coupon) {
                res.status(404).json({ error: "Cupom inválido." });
                return;
            }

            if (!coupon.isActive || new Date(coupon.expirationDate) < new Date()) {
                res.status(400).json({ error: "Cupom expirado ou inativo." });
                return;
            }

            res.status(200).json(coupon);
        } catch (error) {
            console.error("Erro ao validar cupom:", error);
            res.status(500).json({ error: "Erro ao validar cupom." });
        }
    };
}

export default CouponController;