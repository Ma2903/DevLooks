import { Schema, model, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

class Product {
    private static schema: Schema<IProduct> = new Schema<IProduct>({
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    });

    private static model: Model<IProduct> = model<IProduct>("Product", Product.schema);

    static async create(productData: Partial<IProduct>): Promise<IProduct> {
        const product = new Product.model(productData);
        return await product.save();
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
