const bodyParser = require('body-parser');
const ProductController = require('../controllers').ProductController;

module.exports = function (app) {

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to CA application." });
    });

    // create a product
    app.post('/product/create', bodyParser.json(), async (req, res) => {
        if(req.body.name) {
            try  {
                const product = await ProductController.create(req.body.name);
                res.status(201).json(product);
            } catch(err) {
                res.status(409).end();
            }
        } else {
            res.status(400).end();
        }
    });

    app.get("/product/ban/:id", bodyParser.json(), async (req, res) => {
        try {
            const product = await ProductController.banProduct(+req.params.id);
            res.status(200).json(product);
        } catch (err) {
            res.status(409).json(err);
        }
    });

// get all product
    app.get('/api/product', (req, res) => {
        Product.findAll().then(product => res.json(product))
    })
};
