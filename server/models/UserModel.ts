// Ficheiro: server/models/UserModel.ts

import { Schema, model, Document } from "mongoose";

// Interface para um item no carrinho
interface ICartItem {
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
    role: string;
    status: string;
    avatarUrl?: string;
    hasCreatedAvatar?: boolean;
    hasMadePurchase?: boolean;
    cart: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

// Schema para os itens do carrinho
const cartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedSize: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, { _id: false });

// Schema principal do usuário
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telephone: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String },
    complement: { type: String },
    bairro: { type: String },
    cep: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    role: { type: String, default: "user", enum: ['user', 'admin', 'owner'] },
    status: { type: String, default: "active" },
    avatarUrl: { type: String, default: null },
    hasCreatedAvatar: { type: Boolean, default: false },
    hasMadePurchase: { type: Boolean, default: false },
    cart: { type: [cartItemSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Cria e exporta o Model diretamente
const UserModel = model<IUser>("User", UserSchema);

export default UserModel;