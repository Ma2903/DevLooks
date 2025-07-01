import Product, { IProduct } from '../models/ProductModel';

// --- Interfaces para os Objetos de Negócio ---

// Interface base que todos os produtos devem seguir
interface IProductObject {
    id: string;
    name: string;
    price: number;
    category: string;
    displayInfo(): string; // Um método de exemplo
}

// Interface específica para Camiseta, que tem tamanhos
interface ICamisetaObject extends IProductObject {
    availableSizes: string[];
}

// --- Classes Concretas dos Produtos ---

// Classe base para um produto genérico
class BaseProduct implements IProductObject {
    id: string;
    name: string;
    price: number;
    category: string;

    constructor(data: IProduct) {
        this.id = data._id.toString(); // Converte o ID do Mongoose para string
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
    }

    displayInfo(): string {
        return `${this.name} - R$${this.price.toFixed(2)}`;
    }
}

// Classe concreta para Camisetas
class CamisetaObject extends BaseProduct implements ICamisetaObject {
    availableSizes: string[];

    constructor(data: IProduct) {
        super(data); // Chama o construtor da classe pai
        this.availableSizes = data.sizes || []; // Pega os tamanhos do banco
    }

    // Sobrescreve o método para mostrar informações adicionais
    override displayInfo(): string {
        const baseInfo = super.displayInfo();
        return `${baseInfo} (Tamanhos: ${this.availableSizes.join(', ')})`;
    }
}

// Classe concreta para Canecas (ou qualquer outro produto sem tamanho)
class CanecaObject extends BaseProduct {
    constructor(data: IProduct) {
        super(data);
    }
    // Não precisa de lógica adicional por enquanto
}


// --- A Fábrica (Factory Method) ---

export class ProductFactory {
    /**
     * Este é o Factory Method. Ele decide qual classe de objeto instanciar
     * com base na categoria do produto.
     */
    public static createProduct(productData: IProduct): IProductObject {
        switch (productData.category.toLowerCase()) {
            case 'camisetas':
            case 'camiseta dev': // Adicione variações se necessário
                return new CamisetaObject(productData);

            case 'canecas':
            case 'caneca dev':
                return new CanecaObject(productData);
            
            // Para qualquer outra categoria, retorna um produto base
            default:
                return new BaseProduct(productData);
        }
    }

    /**
     * Retorna o Model do Mongoose para operações de banco de dados.
     */
    public static getModel() {
        return Product;
    }
}