const models = require('../models');
const Service = models.Service;

class ServiceController {

    /**
     * @param date_service
     * @param nom
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
    static async completeService(idService) {
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
    static async deleteService(idService) {
        const service = await Service.update({actif: false}, {
            where: {
                id: idService
            }
        });
        return service
    }


    /**
     *
     * @param idAnnex
     * @param user
     * @returns {Promise<void>}
     */
    static async getSeviceList(idAnnex, user) {
        const role = user.getRole();
        if (role.id === 4) {
            return Service.findAll({
                where: {
                    AnnexId: idAnnex,
                    active: true
                }
            });
        }
        return Service.findAll({
            where: {
                AnnexId: idAnnex
            }
        });
    }

    /**
     *
     * @param idAnnex
     * @returns {Promise<void>}
     */
    static async getSeviceById(idAnnex) {
        return Service.findOne({
            where: {
                AnnexId: idAnnex
            }
        });
    }

}


module.exports = ServiceController;
