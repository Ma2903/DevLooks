export class Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;

    constructor(id: number, nome: string, descricao: string, preco: number, estoque: number) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.estoque = estoque;
    }
}