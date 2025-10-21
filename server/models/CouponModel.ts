import { Schema, model, Document } from "mongoose";

// Interface que define a estrutura de um cupom para o TypeScript
export interface ICoupon extends Document {
    code: string;
    discount_percentage: number; // <-- CAMPO ADICIONADO AQUI
    expires_at: Date;          // <-- CAMPO ADICIONADO AQUI
    is_active: boolean;
}

// Schema que define a estrutura do documento no MongoDB
const CouponSchema = new Schema<ICoupon>({
    code: { type: String, required: true, unique: true, uppercase: true },
    discount_percentage: { type: Number, required: true, min: 0, max: 100 },
    expires_at: { type: Date, required: true },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

const CouponModel = model<ICoupon>("Coupon", CouponSchema);

export default CouponModel;