const models = require('../models');
const MailService = require('../service/mail.service');
const Annex = models.Annex;
const Association = models.Association;
const AnnexAvailability = models.AnnexAvailability;
const Day = models.Day;
const Role = models.Role;
const User = models.User;
const Report = models.Report;
const Service = models.Service;


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
        const a = Annex.findOne({
            where:{
                id:annex
            }
        });
        await MailService.sendMail(a.email,"annex");
        return annex;
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
        return "Vous n'avez pas le droit modifier des disponibilité pour cette Annexe"
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
                await manager.setRole(role);
                await manager.save();
                annex.addUser(manager);
                return "Le manager à bien été ajouter";
            }
            return "Cet utilisateur n'existe pas";
        }
        return "Vous n'avez pas le droit d'ajouter des gérant pour cette Annexe"
    }

    static async removeManager(idAnnex, idUser, user) {
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
                    id: idUser
                }
            });
            if (manager) {
                annex.removeUser(manager);
                return "Le manager à bien été supprimer";
            }
            return "Cet utilisateur n'existe pas";
        }
        return "Vous n'avez pas le droit de supprimer pour cette Annexe"
    }

    static async getMyAnnexes(user) {
        const annexList = await user.getAnnexes();
        return annexList.filter(annex => annex.active)
    }

    /**
     *
     * @param id
     * @returns {Promise<any>}
     */
    static async getAnnexByAId(id) {
        let annex = await Annex.findOne({
            include: [{
                model: AnnexAvailability,
                include: Day
            }, User],
            where: {
                id: id,
                valid: true,
                active: true
            }
        });
        return annex;
    }

    /**
     *
     * @param user
     * @param id
     * @returns {Promise<string>}
     */
    static async reportAnnex(user, id) {
        let annex = await Annex.findOne({
            where: {
                id: id,
            }
        });
        if (annex) {
            const reportExist = await Report.findOne({
                reporter: "user",
                annex: annex,
                user: user
            });
            if (reportExist) {
                return "Vous avez déjà reporter " + annex.name;
            }
            const report = await Report.create({
                reporter: "user"
            });
            report.setAnnex(annex);
            report.setUser(user);
            return "Vous venez reporter l'annexe " + annex.name;
        }
        return "Vous ne pouvez pas reporter l'annexe ";

    }

    /**
     *
     * @param nom
     * @param date_service
     * @param description
     * @param quantite
     * @param idAnnex
     * @returns {Promise<void>}
     */
    static async createService(idAnnex, nom, date_service, description, quantite) {

            const newService = await Service.create({
                nom: nom,
                date_service: date_service,
                description: description,
                quantite: quantite,
                status: false,
                actif: true
            });
            newService.setAnnex(idAnnex);
            return newService;
    }

    /**
    * @param idService
    * @returns {Promise<void>}
    */
    static async completeService(idService){
        return await Service.update({status: true}, {
            where: {
                id: idService
            }
        });
    }

    /**
     * @param idService
     * @returns {Promise<void>}
     */
    static async deleteService(idService){
        const service =  await Service.update({actif: false}, {
            where: {
                id: idService
            }
        });
        return service
    }


    static async updateAnnex(name, email, street, zipCode, city, phone, user, id) {
        let annex = await Annex.findOne({
            where: {
                id: id,
            }
        });
        const userManageers = await annex.getUsers();
        const response = userManageers.find(element => element.id === user.id);
        if (response) {
            const annexUpdate = Annex.update({
                name: name,
                email: email,
                street: street,
                zipCode: zipCode,
                city: city,
                phone: phone
            }, {
                where: {
                    id: id,
                }
            });
            return annexUpdate;
        }
        return "Vous n'êtes pas manager de cette annexe"
    }


}


module.exports = AnnexController;
