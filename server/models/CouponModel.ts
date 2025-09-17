// server/models/CouponModel.ts

import { Schema, model, Document } from "mongoose";

// Interface para a tipagem do Cupom
export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expirationDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Schema do Cupom
const CouponSchema = new Schema<ICoupon>({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Cria e exporta o Model diretamente
const CouponModel = model<ICoupon>("Coupon", CouponSchema);

export default CouponModel;