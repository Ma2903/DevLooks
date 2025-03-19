import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    cpf: string;
    password: string;
    telephone: string;
    address: string;
    cep: string;
    city: string;
    state: string;
    country: string;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
