import Product from '../models/ProductModel';
export class ProductFactory {
    static getModel(): Product {
        return Product;
    }
}