// Ficheiro: server/models/OrderModel.ts
import { Schema, model, Document } from "mongoose";
import { IUser } from "./UserModel";

export interface IShippingAddress {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
}

export interface IOrderItem extends Document {
    product: Schema.Types.ObjectId;
    productId?: Schema.Types.ObjectId; // Compatibilidade com código antigo
    name?: string;
    quantity: number;
    price: number;
    image?: string;
    selectedSize?: string;
}

export interface IOrder extends Document {
    user: Schema.Types.ObjectId | IUser;
    items: IOrderItem[];
    total: number;
    status: 'Aguardando Pagamento' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado' | 'paid' | 'pending' | 'cancelled' | 'refunded';
    shippingAddress: IShippingAddress;
    paymentMethod?: string;
    paymentStatus?: string;
    mercadoPagoPaymentId?: string;
    createdAt: Date;
}

const ShippingAddressSchema = new Schema<IShippingAddress>({
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    cep: { type: String, required: true },
}, { _id: false });

const OrderItemSchema = new Schema<IOrderItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: false }, // Compatibilidade
    name: { type: String, required: false },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false },
    selectedSize: { type: String, required: false },
});

const OrderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Aguardando Pagamento', 'Processando', 'Enviado', 'Entregue', 'Cancelado', 'paid', 'pending', 'cancelled', 'refunded'], 
        default: 'Processando' 
    },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    paymentMethod: { type: String, required: false },
    paymentStatus: { type: String, required: false },
    mercadoPagoPaymentId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const OrderModel = model<IOrder>("Order", OrderSchema);

export default OrderModel;