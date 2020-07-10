const models = require('../models');
const Annex = models.Annex;
const Association = models.Association;
const User = models.User;
const Donation = models.Donation;
const Product = models.Product;
const Requerir = models.Requerir;

class DonationController {
    /**
     *
     * @param name
     * @param description
     * @param products
     * @param idAnnex
     * @returns {Promise<void>}
     */
    static async createDonation(name, description, products, idAnnex) {
        const newDonation = await Donation.create({
            nom: name,
            description: description,
            status: false,
            actif: true
        });
        for (let i = 0; i < products.length; i++) {
            const productRequest = await Product.findOne({
                where: {
                    id: products[i].idProduct
                }
            })
            if (productRequest){
                const requerir = await Requerir.create({
                    quantity: products[i].quantity,
                    DonationId: newDonation.id,
                    ProductId: productRequest.id
                })
            }
        }
        newDonation.setAnnex(idAnnex);
        return newDonation;
    }


    /**
     * @param idDonation
     * @param quantityDonation
     * @returns {Promise<void>}
     */
    static async completeDonation(idDonation, quantityDonation){
        return await Donation.update({status: true}, {
            where: {
                id: idDonation,
                quantity: quantityDonation
            }
        });
    }

    /**
     * @param idDonation
     * @returns {Promise<void>}
     */
    static async deleteDonation(idDonation){
        return Donation.update({active: false}, {
            where: {
                id: idDonation
            }
        });
    }

}

module.exports = DonationController;
