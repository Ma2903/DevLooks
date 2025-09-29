// server/models/CouponModel.ts

import { Schema, model, Document } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expirationDate: Date;
    isActive: boolean;
    isSingleUse?: boolean; // << CAMPO ADICIONADO
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isSingleUse: { // << CAMPO ADICIONADO
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const CouponModel = model<ICoupon>("Coupon", CouponSchema);

export default CouponModel;