const models = require('../models');
const Annex = models.Annex;
const Association = models.Association;
const AnnexAvailability = models.AnnexAvailability;
const Day = models.Day;
const Role = models.Role;
const User = models.User;


class AssociationController {

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
    static async createAnnex(name, email, street, zipCode, city, phone, associationId, horaire, user) {

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
            valid: false,
        });
        await annex.setAssociation(association);
        await annex.addUser(user);
        if (horaire) {
            for (let i = 0; i < horaire.length; i++) {
                const day = await Day.findOne({
                    where: {
                        id: horaire[i].idJour
                    }
                });
                const annexAvailability = await AnnexAvailability.create({
                    openingTime: horaire[i].openingTime,
                    closingTime: horaire[i].closingTime
                });
                await annexAvailability.setDay(day);
                await annexAvailability.setAnnex(annex);
            }
        }
        return annex;
    }

    /**
     *
     * @returns {Promise<void>}
     * @param associationId
     */
    static async banAssociation(associationId) {

        const association = await Association.update({active: false}, {
            where: {
                id: associationId
            }
        });
        const annexes = await Annex.findAll({
            where: {
                associationId: associationId
            }
        });
        for (const annex of annexes) {
            annex.active = false;
            await annex.save();
        }
        return association;
    }

    /**
     *
     * @param name
     * @param description
     * @param city
     * @param number
     * @returns {Promise<void>}
     */
    static async updateAssociation(name, description, city, IdAssociation) {
        const association = await Association.update({
            name: name, description: description, city: city
        }, {
            where: {
                id: IdAssociation
            }
        });
        return association;
    }

}


module.exports = AssociationController;
