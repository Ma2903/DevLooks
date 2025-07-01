// server/models/ProductModel.ts

import { Schema, model, Document } from "mongoose";

// A interface agora inclui um campo opcional para tamanhos
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    sizes?: string[]; // Campo opcional para tamanhos (ex: ['P', 'M', 'G'])
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    sizes: { type: [String], required: false }, // Adicionado ao schema
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Métodos estáticos para operações usadas no ProductController (permanecem os mesmos)
ProductSchema.statics.findAll = async function () {
    return this.find();
};

ProductSchema.statics.findById = async function (id: string) {
    return this.findOne({ _id: id });
};

ProductSchema.statics.findByIdAndUpdate = async function (id: string, update: Partial<IProduct>, options: object) {
    return this.findOneAndUpdate({ _id: id }, update, options);
};

ProductSchema.statics.findByIdAndDelete = async function (id: string) {
    return this.findOneAndDelete({ _id: id });
};

const Product = model<IProduct>("Product", ProductSchema);

export default Product;