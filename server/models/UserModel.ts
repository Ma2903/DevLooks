// Ficheiro: DevLooks-main/server/models/UserModel.ts

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

// Interface para o documento do usuário (representa um usuário no Mongoose)
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

// Classe User que encapsula a lógica do Mongoose (SEU PADRÃO ORIGINAL RESTAURADO)
class User {
    // Schema para os itens do carrinho (privado para a classe)
    private static cartItemSchema = new Schema<ICartItem>({
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        selectedSize: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
    }, { _id: false });

    // Schema principal do usuário (privado para a classe)
    private static schema = new Schema<IUser>({
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
        cart: { type: [User.cartItemSchema], default: [] },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    });

    // Cria e armazena o Model do Mongoose
    private static model = model<IUser>("User", User.schema);

    // --- MÉTODOS ESTÁTICOS PARA INTERAGIR COM O BANCO (SEU PADRÃO ORIGINAL) ---

    static async create(userData: Partial<IUser>): Promise<IUser> {
        return await User.model.create(userData);
    }

    static async findAll(): Promise<IUser[]> {
        return await User.model.find().select('-password');
    }

    static async findById(id: string): Promise<IUser | null> {
        return await User.model.findById(id).select('-password');
    }

    static async findByEmail(email: string): Promise<IUser | null> {
        // Para o login, precisamos da senha, então não usamos .select('-password') aqui
        return await User.model.findOne({ email });
    }

    static async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return await User.model.findByIdAndUpdate(id, userData, { new: true }).select('-password');
    }

    static async delete(id: string): Promise<IUser | null> {
        return await User.model.findByIdAndDelete(id);
    }
}

export default User;