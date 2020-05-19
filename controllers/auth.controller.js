const models = require('../models');
const User = models.User;
const Role = models.Role;
const Image = models.Image;
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

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
     * @param imageLink
     * @returns {Promise<User>}
     */
    static async subscribe(login, firstname, email, lastname, password, street, zipCode, city, phone, roleId, birthdate, imageLink) {

        const role = await Role.findOne({
            where: {
                id: 1
            }
        });

        let image = null;
        if (imageLink != undefined) {
            image = await Image.create({
                link: imageLink
            });
        }
        ;
        let validForVolunteer = null;
        if (roleId == 2) {
            validForVolunteer = false;
        }
        const user = await User.create({
            login,
            firstname,
            email,
            lastname,
            street,
            zipCode,
            city,
            phone,
            password: await bcrypt.hash(password, 10),
            active: true,
            birthdate: birthdate,
            validForVolunteer: validForVolunteer
        });
        if (image != null) {
            await user.setImage(image);
        }
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
                if (userFound.active) {
                    return await userFound.save();
                } else if (!userFound.active) {
                    return "Vous avez été banni";
                }
            }
        }
        return {
            message:"L' email ou le mot de passe est incorrect"
        };
    }
}

module.exports = AuthController;
