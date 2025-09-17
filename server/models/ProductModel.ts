import { Schema, model, Document } from "mongoose";

// Interface para o documento do produto
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    sizes?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Classe Product que encapsula a lógica do Mongoose (SEU PADRÃO ORIGINAL RESTAURADO)
class Product {
    private static schema = new Schema<IProduct>({
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true },
        image: { type: String, required: true },
        sizes: { type: [String], required: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    });

    private static model = model<IProduct>("Product", Product.schema);

    // --- MÉTODOS ESTÁTICOS PARA INTERAGIR COM O BANCO ---

    static async create(productData: Partial<IProduct>): Promise<IProduct> {
        return await Product.model.create(productData);
    }

    static async findAll(): Promise<IProduct[]> {
        return await Product.model.find();
    }

    static async findById(id: string): Promise<IProduct | null> {
        return await Product.model.findById(id);
    }

    static async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        return await Product.model.findByIdAndUpdate(id, productData, { new: true });
    }

    static async delete(id: string): Promise<IProduct | null> {
        return await Product.model.findByIdAndDelete(id);
    }
}

export default Product;