import DataMongoManager from '../config/database';
import express from 'express';

const dataMongoManager = new DataMongoManager('products');  

export default class ProductsController {
    async getProducts(req, res) {
        const data = await dataMongoManager.buscar({});
        res.send(data);
    }
    async getProductById(req: express.Request, res: express.Response) {
        const data = await dataMongoManager.buscar({ id: parseInt(req.params.id) });
        res.send(data);
    }
    async createProduct(req, res) {
        const data = req.body;
        dataMongoManager.inserir(data);
        res.send({error : false , message : 'Product created'});
    }
    async updateProduct(req, res) {
        const data = req.body;
        dataMongoManager.atualizar({ id: parseInt(req.params.id) }, data);
        res.send({error : false , message : 'Product updated'});
    }
    deleteProduct(req, res) {
        dataMongoManager.deletar({ id: parseInt(req.params.id) });
        res.send({error : false , message : 'Product deleted'});
    }
}
