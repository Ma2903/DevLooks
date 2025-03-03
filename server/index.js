import express from 'express';
import cors from 'cors'

const app = express();
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

const produtos = [ 
    {
        id: 1,
        name: 'Produto 1',
        image: 'camisa.jpg',
        price: 99.99,
        category: 'Camisetas'
    },
    {
        id: 5,
        name: 'Produto 5',
        image : 'camisa2.jpeg',
        price: 499.99,
        category: 'Camisetas'
    }
  ]

app.get('/data', (req, res) => {
    res.send(produtos);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
