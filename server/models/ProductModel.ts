import { Schema, model, Document } from "mongoose";

// Interface que define a estrutura de um produto para o TypeScript
export interface IProduct extends Document {
    _id: string | number;
    name: string;
    description: string;
    price: number;
    promotion_price?: number; // <-- CAMPO ADICIONADO AQUI (opcional)
    category: string;
    stock: number;
    image: string;
    images?: string[];
    reviews?: {
        user: Schema.Types.ObjectId;
        rating: number;
        comment: string;
        images?: string[];
        createdAt?: Date;
    }[];
    brand?: string;
    sku?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Schema que define a estrutura do documento no MongoDB
const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    promotion_price: { type: Number },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    reviews: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        images: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
    }],
    brand: { type: String },
    sku: { type: String, unique: true, sparse: true },
    tags: [{ type: String }],
}, { timestamps: true });

const ProductModel = model<IProduct>("Product", ProductSchema);

export default ProductModel;