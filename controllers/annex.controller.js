const models = require('../models');
const Annex = models.Annex;
const Association = models.Association;
const AnnexAvailability = models.AnnexAvailability;
const Day = models.Day;

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
    static async createAnnex(name, email, street, zipCode, city, phone, associationId, horaire) {

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
        if (horaire) {
            for (let i = 0; i < horaire.length; i++) {
                const day = await Day.findOne({
                    where: {
                        id: horaire[i].idJour
                    }
                });
               const annexAvailability = await AnnexAvailability.create({
                   openingTime:horaire[i].openingTime,
                   closingTime:horaire[i].closingTime
               });
              await annexAvailability.setDay(day);
              await annexAvailability.setAnnex(annex);
            }
        }
        return annex;
    }

}

module.exports = AnnexController;
