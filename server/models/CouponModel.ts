import { Schema, model, Document } from "mongoose";

// Interface para tipagem do cupom
export interface ICoupon extends Document {
    code: string; // Código do cupom (ex: PROMO10)
    discountType: 'percentage' | 'fixed'; // Tipo de desconto: percentual ou fixo
    discountValue: number; // Valor do desconto
    expirationDate: Date; // Data de expiração
    isActive: boolean; // Status do cupom
    createdAt: Date;
    updatedAt: Date;
}

// Schema do Mongoose
const CouponSchema = new Schema<ICoupon>({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Métodos estáticos para operações
CouponSchema.statics.findAll = function () {
    return this.find();
};

CouponSchema.statics.findById = function (id: string) {
    return this.findOne({ _id: id });
};

CouponSchema.statics.findByCode = function (code: string) {
    return this.findOne({ code: code.toUpperCase() });
};

CouponSchema.statics.findByIdAndUpdate = function (id: string, update: Partial<ICoupon>) {
    return this.findOneAndUpdate({ _id: id }, update, { new: true });
};

CouponSchema.statics.findByIdAndDelete = function (id: string) {
    return this.findOneAndDelete({ _id: id });
};

const Coupon = model<ICoupon>("Coupon", CouponSchema);

export default Coupon;