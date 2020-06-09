const models = require('../models');
const Product = models.Product;


class ProductController {

    /**
     * @param name
     * @returns {Promise<Product>}
     */
    static create(name) {
        return Product.create({
            name
        });
    }

    /**
     *
     * @param productId
     * @returns {Promise<void>}
     */
    static async banProduct(productId) {
        return Product.update({active: false}, {
            where: {
                id: productId
            }
        });
    }
}

module.exports = ProductController;
