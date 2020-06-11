const bodyParser = require('body-parser');
const ProductController = require('../controllers').ProductController;
const AuthMiddleware = require('../middlewares/auth.middleware');


module.exports = function (app) {

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to CA application." });
    });

    // create a product
    app.post('/product/create', AuthMiddleware.isManager(), bodyParser.json(), async (req, res) => {
        if(req.body.name && req.body.typeId) {
            try  {
                const product = await ProductController.create(req.body.typeId, req.body.name);
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
};
