import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string; 
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Métodos estáticos para operações usadas no ProductController
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
