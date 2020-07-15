const models = require('../models');
const User = models.User;
const Role = models.Role;
const Image = models.Image;
const Service = models.Service;
const Donation = models.Image;
const Annex = models.Annex;
const UserDonation = models.UserDonation;
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const Sequelize = require('sequelize');

class AuthController {

    /**
     * @param login
     * @param firstname
     * @param email
     * @param lastname
     * @param password
     * @param street
     * @param zipCode
     * @param city
     * @param phone
     * @param roleId
     * @param birthdate
     * @returns {Promise<User>}
     */
    static async subscribe(login, firstname, email, lastname, password, street, zipCode, city, phone, roleId, birthdate) {

        const role = await Role.findOne({
            where: {
                id: roleId
            }
        });
        let validForVolunteer = null;
        if (role.id === 2) {
            validForVolunteer = "ATTENTE";
        }
        let validForUser = "ATTENTE";
        const user = await User.create({
            login,
            firstname,
            email,
            lastname,
            street,
            zipCode,
            city,
            phone,
            validForUser: validForUser,
            password: await bcrypt.hash(password, 10),
            active: true,
            birthdate: birthdate,
            validForVolunteer: validForVolunteer,

        });
        await user.setRole(role);
        return user;
    }


    /**
     * @param login
     * @param password
     * @returns {Promise<string>}
     */
    static async login(login, password) {
        const userFound = await User.findOne({
            where: {
                login: login
            }
        });
        if (userFound) {
            const isCorrect = await bcrypt.compare(password, userFound.password);
            if (isCorrect) {
                const token = jsonwebtoken.sign({
                        email: userFound.email,
                        userId: userFound.id,
                        role: userFound.role

                    },
                    'secret',
                    {
                        expiresIn: "1h"
                    }
                );
                userFound.token = token;
                if (userFound.validForUser === "ATTENTE") {
                    return {
                        message: "Votre inscription n'a pas encore été validée"
                    };
                }
                if (userFound.validForUser === "REFUSE") {
                    return {
                        message: "Votre inscription a été refusée"
                    };
                }
                if (userFound.active) {
                    const helpedAnnexes = [];
                    helpedAnnexes.push(...await this.getAnnexHelpedByServices(userFound.id));
                    const us = await this.getUserDonationList(userFound.id);

                    for (let i = 0; i < us.length; i++) {
                        const donation = await this.getDonationList(us[i].DonationId);
                        const annex = await this.getAnnex(donation.AnnexId);
                        if (!helpedAnnexes.some(a => a.id === annex.id)) {
                            helpedAnnexes.push(annex);
                        }
                    }
                    const pendingDonations = [];
                    const pendingServices = [];
                    pendingServices.push(...await this.getPendingServices(userFound.id));
                    pendingDonations.push(...await this.getPendingDonation(userFound.id));
                    const u = await userFound.save();
                    return {
                        user: u,
                        helpedAnnexes: helpedAnnexes,
                        pendingServices: pendingServices,
                        pendingDonations: pendingDonations
                    };

                } else if (!userFound.active) {
                    return {
                        message: "Vous avez été banni de ce site"
                    };
                }
            }
        }
        return {
            message: "L' email ou le mot de passe est incorrect"
        };
    }

    static async getUserDonationList(id) {
        return UserDonation.findAll({
            attributes: ['DonationId'],
            where: {
                give: true,
                UserId: id
            },
            group: ['UserDonation.DonationId']
        });
    }

    static async getDonationList(idDonation) {
        return Donation.findAll({
            attributes: ['AnnexId'],
            where: {
                id: idDonation
            },
            group: ['Donation.AnnexId']
        });
    }

    static async getAnnex(idAnnex) {
        return Annex.findOne({
            where: {
                id: idAnnex
            }
        });
    }

    static async getAnnexHelpedByServices(idUser) {
        const array = [];
        const services = await Service.findAll({
            where: {
                status: true
            }
        });
        const myServices = [];
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            const users = await service.getUsers();
            if (users.some(user => user.id === idUser)) {
                myServices.push(service);
            }
        }
        for (let i = 0; i < myServices.length; i++) {
            const annex = await this.getAnnex(myServices[i].AnnexId);
            if (!array.some(a => a.id === annex.id)) {
                array.push(annex);
            }
        }
        return array;
    }

    static async getPendingServices(idUser) {
        const services = await Service.findAll({
            where: {
                status: false
            }
        });
        const myServices = [];
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            const users = await service.getUsers();
            if (users.some(user => user.id === idUser)) {
                myServices.push(service);
            }
        }
        return myServices;
    }

    static async getPendingDonation(idUser) {
        const us = await UserDonation.findAll({
            where: {
                UserId: idUser,
                give: false
            }
        });
        const myDonations = [];
        for (let i = 0; i < us.length; i++) {
            const donation = await Donation.findOne({
                where: {
                    id: us[i].DonationId
                }
            });
            if (!myDonations.some(d => d.id === donation.id)) {
                myDonations.push(donation);
            }
        }
        return myDonations;
    }

}

module.exports = AuthController;
