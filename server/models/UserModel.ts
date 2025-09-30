// server/models/UserModel.ts

import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

// --- CORREÇÃO AQUI ---
// A interface para um subdocumento não precisa estender 'Document'
interface ICartItem {
    productId: Schema.Types.ObjectId;
    quantity: number;
    selectedSize?: string;
    name: string;
    price: number;
    image: string;
}

// O restante do arquivo continua igual...
interface IAddress {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    cep?: string;
    city?: string;
    state?: string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    cpf: string;
    password: string;
    telephone: string;
    address: IAddress;
    country: string;
    role: 'user' | 'admin' | 'owner';
    status: string;
    avatarUrl?: string;
    hasCreatedAvatar?: boolean;
    avatarPasses?: number;
    savedAvatars?: string[];
    hasMadePurchase?: boolean;
    usedCoupons?: string[];
    cart: ICartItem[]; // Agora usa a interface correta
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Nenhuma alteração necessária nos schemas
const cartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedSize: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, { _id: false });

const AddressSchema = new Schema<IAddress>({
    street: { type: String },
    number: { type: String },
    complement: { type: String },
    neighborhood: { type: String },
    cep: { type: String },
    city: { type: String },
    state: { type: String },
}, { _id: false });


const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    cpf: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telephone: { type: String, required: true },
    address: { type: AddressSchema },
    country: { type: String },
    role: { type: String, default: "user", enum: ['user', 'admin', 'owner'] },
    status: { type: String, default: "active" },
    avatarUrl: { type: String },
    hasCreatedAvatar: { type: Boolean, default: false },
    avatarPasses: { type: Number, default: 0 },
    savedAvatars: { type: [String], default: [] },
    hasMadePurchase: { type: Boolean, default: false },
    usedCoupons: { type: [String], default: [] },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    cart: { type: [cartItemSchema], default: [] },
}, { timestamps: true });

UserSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;