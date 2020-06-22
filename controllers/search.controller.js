const models = require('../models');
const Annex = models.Annex;
const Association = models.Association;
const User = models.User;
const AnnexAvailability = models.AnnexAvailability;
const Day = models.Day;
const Image = models.Image;
const Report = models.Report;
const Role = models.Role;
const Service = models.Service;

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

    /**
     * @returns {Promise<any>}
     */
    static async getAllUsers() {
        return await User.findAll();
    }

    /**
     * @returns {Promise<any>}
     */
    static async getAllAnnexAvailabilities() {
        return await AnnexAvailability.findAll();
    }

    /**
     * @returns {Promise<any>}
     */
    static async getAllDays() {
        return await Day.findAll();
    }

    /**
     * @returns {Promise<any>}
     */
    static async getAllImages() {
        return await Image.findAll();
    }

    /**
     * @returns {Promise<any>}
     */
    static async getAllReports() {
        return await Report.findAll();
    }

    /**
     * @returns {Promise<any>}
     */
    static async getAllRoles() {
        return await Role.findAll();
    }

    /**
     * @returns {Promise<any>}
     */
    static async getAllServices() {
        return await Service.findAll();
    }

}
module.exports = SearchController;
