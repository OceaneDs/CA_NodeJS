const models = require('../models');
const Annex = models.Annex;
const Association = models.Association;
const UserDonation = models.UserDonation;
const Donation = models.Donation;
const Product = models.Product;
const Requerir = models.Requerir;
const Sequelize = require('sequelize');

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
            if (productRequest) {
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
    static async completeDonation(idDonation, quantityDonation) {
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
    static async deleteDonation(idDonation) {
        return Donation.update({active: false}, {
            where: {
                id: idDonation
            }
        });
    }

    static async getDonationList(idAnnex, user) {
        const role = user.getRole();
        if (role.id === 4) {
            return Donation.findAll({
                where: {
                    AnnexId: idAnnex,
                    active: true
                }
            });
        }
        return Donation.findAll({
            where: {
                AnnexId: idAnnex
            }
        });
    }

    static async getDonationById(idDonation) {
        return Donation.findOne({
            where: {
                id: idDonation
            }
        })
    }

    static async answerDonation(donations, user, idDonation) {
        for (let i = 0; i < donations.length; i++) {
            const donation = await UserDonation.create({
                UserId: user.id,
                quantity: donations[i].quantity,
                ProductId: donations[i].productId,
                DonationId: idDonation,
                give: false
            });
            const requerir = await Requerir.update({quantity: sequelize.literal('quantity -'+donations[i].quantity) }, {
                where: {
                    DonationId: idDonation,
                    ProductId: donations[i].productId
                }
            });
        }
        return {message: "Votre donation a bien été enregistré"}
    }

}

module.exports = DonationController;
