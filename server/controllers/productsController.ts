import DataMongoManager from '../config/database';

const dataMongoManager = new DataMongoManager('products');  

export default class ProductsController {
    async getProducts(req, res) {
        const data = await dataMongoManager.buscar({});
        res.send(data);
    }
    getProduct(req, res) {
        res.send('GET /products/:id');
    }
    createProduct(req, res) {
        res.send('POST /products');
    }
    updateProduct(req, res) {
        res.send('PUT /products/:id');
    }
    deleteProduct(req, res) {
        res.send('DELETE /products/:id');
    }
}
