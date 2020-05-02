const models = require('../models');
const Annex = models.Annex;
const Association = models.Association;

class AnnexController {

    /**
     * @param name
     * @param email
     * @param street
     * @param zipCode
     * @param city
     * @param phone
     * @param associationId
     * @returns {Promise<void>}
     */
    static async createAnnex(name, email, street, zipCode, city, phone, associationId) {

        const association = await Association.findOne({
            where: {
                id: associationId
            }
        });
        const annex = await Annex.create({
            name,
            email,
            street,
            zipCode,
            city,
            phone,
            active: true,
        });
        await annex.setAssociation(association);
        return annex;
    }

}

module.exports = AnnexController;
