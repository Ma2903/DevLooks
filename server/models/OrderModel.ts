// server/models/OrderModel.ts
import { Schema, model, Document } from "mongoose";
import { IUser } from "./UserModel";

// Interface para o endereço de entrega, que será aninhado no Pedido
export interface IShippingAddress {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
}

// Interface para os itens do pedido (permanece a mesma)
export interface IOrderItem extends Document {
    productId: Schema.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    image: string;
    selectedSize?: string;
}

// Interface principal do Pedido
export interface IOrder extends Document {
    user: Schema.Types.ObjectId | IUser;
    items: IOrderItem[];
    total: number;
    status: 'Aguardando Pagamento' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
    shippingAddress: IShippingAddress; // NOVO CAMPO
    createdAt: Date;
}

// Schema para o endereço de entrega
const ShippingAddressSchema = new Schema<IShippingAddress>({
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    cep: { type: String, required: true },
}, { _id: false });

// Schema para os itens do pedido (permanece o mesmo)
const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    selectedSize: { type: String, required: false },
});

// Schema principal do Pedido
const OrderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ['Aguardando Pagamento', 'Processando', 'Enviado', 'Entregue', 'Cancelado'], default: 'Processando' },
    shippingAddress: { type: ShippingAddressSchema, required: true }, // NOVO CAMPO
    createdAt: { type: Date, default: Date.now },
});

const OrderModel = model<IOrder>("Order", OrderSchema);

export default OrderModel;