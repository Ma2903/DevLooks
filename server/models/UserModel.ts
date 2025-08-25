import { Schema, model, Document } from "mongoose";

interface ICartItem {
    productId: Schema.Types.ObjectId;
    quantity: number;
    selectedSize?: string;
    name: string;
    price: number;
    image: string;
}
// Interface para tipagem do usuário
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
    cart: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

// Criando a classe User que encapsula o Schema e métodos
class User {
     private static cartItemSchema = new Schema<ICartItem>({
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        selectedSize: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
    }, { _id: false });

    private static schema = new Schema<IUser>({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        cpf: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        telephone: { type: String, required: true },
        address: { type: String, required: true },
        number: { type: String, required: false },
        complement: { type: String, required: false },
        bairro: { type: String, required: false },
        cep: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        role: { type: String, default: "user", enum: ['user', 'admin', 'owner'] },
        status: { type: String, default: "active" },
        avatarUrl: { type: String, required: false, default: null },
        hasCreatedAvatar: { type: Boolean, default: false },
        cart: { type: [User.cartItemSchema], default: [] },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    });

    // Criando o Model do Mongoose
    private static model = model<IUser>("User", User.schema);

    // Criar um novo usuário
    static async create(userData: Partial<IUser>): Promise<IUser> {
        const user = new User.model(userData);
        return await user.save();
    }

    // Buscar todos os usuários
    static async findAll(): Promise<IUser[]> {
        return await User.model.find();
    }

    // Buscar usuário por ID
    static async findById(id: string): Promise<IUser | null> {
        return await User.model.findById(id);
    }

    static async findByEmail(email: string): Promise<IUser | null> {
        return await User.model.findOne({ email });
    }

    // Atualizar usuário
    static async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return await User.model.findByIdAndUpdate(id, userData, { new: true });
    }

    // Deletar usuário
    static async delete(id: string): Promise<IUser | null> {
        return await User.model.findByIdAndDelete(id);
    }
}

export default User;