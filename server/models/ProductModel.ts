// server/models/ProductModel.ts

import { Schema, model, Document } from "mongoose";

// Interface para a tipagem do Produto
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

// Schema do Produto
const ProductSchema = new Schema<IProduct>({
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

// Cria e exporta o Model diretamente
const ProductModel = model<IProduct>("Product", ProductSchema);

export default ProductModel;