const models = require('../models');
const Annex = models.Annex;
const Association = models.Association;

class SearchController {

    /**
     * @returns {Promise<any>}
     */
    static async getAllAnnexes() {
        return await Annex.findAll();
    }

    /**
     * @returns {Promise<any>}
     */
    static async getAllAssociations() {
        return await Association.findAll();
    }
}

module.exports = SearchController;
