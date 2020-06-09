const models = require('../models');
const Product = models.Product;


class ProductController {

    /**
     * @param id
     * @param name
     * @returns {Promise<Product>}
     */
    static create(id, name) {
        return Product.create({
            TypeId: id,
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
