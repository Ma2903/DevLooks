import Product, { IProduct } from '../models/ProductModel';

// --- Interfaces ---

interface IProductObject {
    id: string;
    name: string;
    price: number;
    category: string;
    displayInfo(): string;
}

// Interface para produtos que possuem grade de tamanhos
interface ISizedProduct extends IProductObject {
    availableSizes: string[];
}

// --- Classes Concretas (4 Tipos Diferentes) ---

// Classe Base
class BaseProduct implements IProductObject {
    id: string;
    name: string;
    price: number;
    category: string;

    constructor(data: IProduct) {
        this.id = data._id.toString();
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
    }

    displayInfo(): string {
        return `${this.name} - R$${this.price.toFixed(2)}`;
    }
}

// 1. Camisetas: Grade de Letras (P, M, G...)
class CamisetaObject extends BaseProduct implements ISizedProduct {
    availableSizes: string[];

    constructor(data: IProduct) {
        super(data);
        this.availableSizes = data.sizes || ['P', 'M', 'G', 'GG'];
    }

    override displayInfo(): string {
        return `${super.displayInfo()} (T-Shirt Dev)`;
    }
}

// 2. Moletons: Grade de Letras + Atributo de conforto
class MoletomObject extends BaseProduct implements ISizedProduct {
    availableSizes: string[];

    constructor(data: IProduct) {
        super(data);
        this.availableSizes = data.sizes || ['P', 'M', 'G', 'GG'];
    }

    override displayInfo(): string {
        return `${super.displayInfo()} (Inverno - Conforto Máximo)`;
    }
}

// 3. Calças: Grade Numérica (38, 40, 42...)
class CalcaObject extends BaseProduct implements ISizedProduct {
    availableSizes: string[];

    constructor(data: IProduct) {
        super(data);
        // Se não vier do banco, define padrão numérico
        this.availableSizes = data.sizes && data.sizes.length > 0 ? data.sizes : ['38', '40', '42', '44', '46'];
    }

    override displayInfo(): string {
        return `${super.displayInfo()} (Numeração: ${this.availableSizes.join(', ')})`;
    }
}

// 4. Acessórios: Tamanho Único
class AcessorioObject extends BaseProduct {
    constructor(data: IProduct) {
        super(data);
    }

    override displayInfo(): string {
        return `${super.displayInfo()} (Tamanho Único)`;
    }
}

// --- Factory ---

export class ProductFactory {
    /**
     * Factory Method: Fabrica o objeto correto baseado na categoria.
     * Atende ao requisito de "Mínimo 4 produtos diferentes".
     */
    public static createProduct(productData: IProduct): IProductObject {
        // Normaliza para minúsculas e remove acentos para evitar erros
        const category = productData.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        switch (category) {
            case 'camisetas':
                return new CamisetaObject(productData);
            
            case 'moletons':
                return new MoletomObject(productData);
            
            case 'calcas': 
                return new CalcaObject(productData);
            
            case 'acessorios':
                return new AcessorioObject(productData);

            default:
                return new BaseProduct(productData);
        }
    }

    public static getModel() {
        return Product;
    }
}