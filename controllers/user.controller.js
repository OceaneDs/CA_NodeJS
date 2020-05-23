const models = require('../models');
const User = models.User;
const Annex = models.Annex;
const Report = models.Report;

class UserController {

    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    static async banUser(userId) {

        const user = await User.update({active: false}, {
            where: {
                id: userId
            }
        });
    }

    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    static async validateUser(userId) {

        const user = await User.update({validForVolunteer: true}, {
            where: {
                id: userId
            }
        });
    }

    static async reportUser(idAnnex, idUser) {
        const user = await User.findOne({
            where: {
                id: idUser
            }
        });
        const annex = await Annex.findOne({
            where: {
                id: idAnnex
            }
        });
        if (annex && user) {
            const reportExist = await Report.findOne({
                reporter: "annex",
                annex: annex,
                user: user
            });
            if (reportExist) {
                return "Vous avez déjà reporter " + user.firstname + " " + user.lastname;
            }
            const report = await Report.create({
                reporter: "annex"
            });
            report.setAnnex(annex);
            report.setUser(user);
            return "Vous venez de reporter l'utilisateur " + user.firstname + " " + user.lastname;
        }
        return "Vous ne pouvez pas reporter l'utilisateur ";
    }
}

module.exports = UserController;
