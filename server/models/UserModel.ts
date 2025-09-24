import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

// Interface para um item no carrinho
interface ICartItem extends Document {
    productId: Schema.Types.ObjectId;
    quantity: number;
    selectedSize?: string;
    name: string;
    price: number;
    image: string;
}

// Interface para o documento do usuário
export interface IUser extends Document {
    name: string;
    email: string;
    cpf: string;
    password: string;
    telephone: string;
    address: string;
    number?: string;
    complement?: string;
    bairro?: string;
    cep: string;
    city: string;
    state: string;
    country: string;
    role: 'user' | 'admin' | 'owner';
    status: string;
    avatarUrl?: string;
    hasCreatedAvatar?: boolean;
    hasMadePurchase?: boolean;
    cart: ICartItem[];
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedSize: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, { _id: false });

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    cpf: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telephone: { type: String, required: true },
    address: { type: String },
    number: { type: String },
    complement: { type: String },
    bairro: { type: String },
    cep: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    role: { type: String, default: "user", enum: ['user', 'admin', 'owner'] },
    status: { type: String, default: "active" },
    avatarUrl: { type: String, default: null },
    hasCreatedAvatar: { type: Boolean, default: false },
    hasMadePurchase: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    cart: { type: [cartItemSchema], default: [] },
}, { timestamps: true });

// Middleware para criptografar a senha antes de salvar
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