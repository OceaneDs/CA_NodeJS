const models = require('../models');
const User = models.User;
const Annex = models.Annex;
const Report = models.Report;
const Role = models.Role;
const Service = models.Service;
const MailService = require('../service/mail.service');

class UserController {

    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    static async banUser(userId) {

        const user = await User.update({active: false, validForVolunteer: "REFUSE", validForUser: "REFUSE"}, {
            where: {
                id: userId
            }
        });
        const u = await User.findOne({
            where: {
                id: userId
            }
        });
        await MailService.sendMail(u.email, 'user');
    }

    /**
     *
     * @param userId
     * @param response
     * @returns {Promise<void>}
     */
    static async validateVolunteer(userId, response) {
        let RoleId = 2;
        if (response === "REFUSE") {
            RoleId = 1
        }
        const user = await User.update({validForVolunteer: response, RoleId: RoleId}, {
            where: {
                id: userId
            }
        });
        return user;
    }

    static async validateUser(userId, response) {
        let active = true;
        if (response === "REFUSE") {
            active = false;
        }
        const user = await User.update({validateUser: response, active: active}, {
            where: {
                id: userId
            }
        });
        this.banUser()
        return user;
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

    static async updateUser(validForVolunteer, login, firstname, email, lastname, street, zipCode, city, phone, roleId, birthdate, idUser) {
        const role = await Role.findOne({
            where: {
                id: roleId
            }
        });
        const user = await User.update({
            login: login, firstname: firstname, email: email,
            lastname: lastname, street: street, zipCode: street, city: city,
            phone: phone, birthdate: birthdate, validForVolunteer: validForVolunteer, RoleId: role.id,
        }, {
            where: {
                id: idUser
            }
        });
        return user;
    }


    /**
     * @param idUser
     * @param idService
     * @returns {Promise<void>}
     */
    static async answerService(idUser, idService) {
        const service = await Service.findOne({
            where: {
                id: idService
            }
        });
        const user = await User.findOne({
            where: {
                id: idUser
            }
        });
        if (user) {
            if (user.RoleId === 1) {
                return {message: "Vous n'avez pas le droit de répondre aà un service"}
            }
            service.addUser(user)
        }
        return service;
    }

    static async getAllUsers() {
        return User.findAll({
            include: Role
        });
    }
}

module.exports = UserController;
