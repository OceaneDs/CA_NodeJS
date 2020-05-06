const models = require('../models');
const Annex = models.Annex;
const Association = models.Association;
const AnnexAvailability = models.AnnexAvailability;
const Day = models.Day;
const Role = models.Role;
const User = models.User;


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
     * @param annexId
     * @returns {Promise<void>}
     */
    static async banAnnex(annexId) {

        const annex = await Annex.update({active: false}, {
            where: {
                id: annexId
            }
        });
    }

    /**
     *
     * @param annexId
     * @returns {Promise<void>}
     */
    static async validateAnnex(annexId) {
        const annexSearch = await Annex.findOne({
            where: {
                id: annexId
            }
        });
        const role = await Role.findOne({
            where: {
                id: 4
            }
        });
        const users = await annexSearch.getUsers();
        for (let i = 0; i < users.length; i++) {
            await users[i].setRole(role);
        }
        const annex = await Annex.update({valid: true}, {
            where: {
                id: annexId
            }
        });
    }

    /**
     *
     * @param annexId
     * @param horaire
     * @param user
     * @returns {Promise<Credential>}
     */
    static async createAvailability(annexId, horaire, user) {

        // verifier sir le mec est le gerant pour l'annex
        const annex = await Annex.findOne({
            where: {
                id: annexId
            }
        });
        const users = await annex.getUsers();
        const u = users.find(element => element.id === user.id);
        const role = await user.getRole();
        if (u || role.id === 3) {
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
                    await annexAvailability.save()
                }
            }
            return annex;
        }
        return "Vous n'avez pas le droit créer des disponibilité pour cette Annexe";
    }

    /**
     *
     * @param idAnnex
     * @param idavailability
     * @param openingTime
     * @param closingTime
     * @param user
     * @returns {Promise<string|*>}
     */
    static async updateAvailability(idAnnex, idavailability, openingTime, closingTime, user) {

        const annex = await Annex.findOne({
            where: {
                id: idAnnex
            }
        });
        const users = await annex.getUsers();
        const u = users.find(element => element.id === user.id);
        const role = await user.getRole();
        if (u || role.id === 3) {
            const h = await AnnexAvailability.update({openingTime: openingTime, closingTime: closingTime}, {
                where: {
                    id: idavailability
                }
            });

            return h;
        }
        return "Vous n'avez pas le droit créer des disponibilité pour cette Annexe"
    }

    /**
     *
     * @param idAnnex
     * @param email
     * @param user
     * @returns {Promise<void>}
     */
    static async addManager(idAnnex, email, user) {
        const annex = await Annex.findOne({
            where: {
                id: idAnnex
            }
        });
        const users = await annex.getUsers();
        const u = users.find(element => element.id === user.id);
        const role = await user.getRole();
        if (u || role.id === 3) {
            const manager = await User.findOne({
                where: {
                    email: email
                }
            });
            if (manager) {
                annex.addUser(manager);
                return manager;
            }
            return ;
        }
        return "Vous n'avez pas le droit créer des disponibilité pour cette Annexe"
    }
}


module
    .exports = AnnexController;
