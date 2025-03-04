import MongoDBManager from '../config/database';

export default class ProductsController {
    async getProducts(req, res) {
        const data = await MongoDBManager();
        res.send(data)
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
