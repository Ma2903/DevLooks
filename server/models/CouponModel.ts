import { Schema, model, Document } from "mongoose";

// Interface que define a estrutura de um cupom para o TypeScript
export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expirationDate: Date;
    isActive: boolean;
    isSingleUse: boolean;
}

// Schema que define a estrutura do documento no MongoDB
const CouponSchema = new Schema<ICoupon>({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, required: true, enum: ['percentage', 'fixed'] },
    discountValue: { type: Number, required: true, min: 0 },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isSingleUse: { type: Boolean, default: false },
}, { timestamps: true });

const CouponModel = model<ICoupon>("Coupon", CouponSchema);

export default CouponModel;