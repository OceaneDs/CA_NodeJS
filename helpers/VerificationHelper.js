const models = require('../models');
const User = models.User;

class VerificationHelper {

    static async emailAlreadyExiest(email, res) {
        try {
            const user = await this.userFromEmail(email);
            if (user) {
                let response = {
                    Code: 400,
                    Message: "Cet email existe déjà"
                };
                try {
                    res.status(response.Code).json(response.Message);
                } catch (e) {
                    console.log(e);
                }
                return false;
            }
        } catch (e) {
            console.log(e)
        }
        return true;
    }

    static async loginAlreadyExiest(login, res) {
        try {
            const user = await this.userFromLogin(login);
            if (user) {
                let response = {
                    Code: 400,
                    Message: "Ce login existe déjà"
                };
                try {
                    res.status(response.Code).json(response.Message);
                } catch (e) {
                    console.log(e);
                }
                return false;
            }
        } catch (e) {
            console.log(e)
        }
        return true;
    }

    static async userFromEmail(email) {
        return User.findOne({
            where: {
                email: email
            }
        });
    }

    static async userFromLogin(login) {
        return User.findOne({
            where: {
                login: login
            }
        });
    }

    static allRequiredParam(...args) {
        for (let i = 0; i < args.length - 1; i++) {
            if (!args[i] && typeof args[i] !== "boolean") {
                let response = {
                    Code: 400,
                    Message: "Certains Champs obligatoires ne  sont pas renseignés"
                };
                const res = args[args.length - 1];
                try {
                    res.status(response.Code).json(response.Message);
                } catch (e) {
                    console.log(e);
                }
                return false;
            }
        }
        return true;
    }

    static passwordCormimationGood(password, passwordConfirm, res) {
        if (password !== passwordConfirm) {
            let response = {
                Code: 400,
                Message: "le mot de passe de doit être similaire à celui de la confirmation"
            };
            try {
                res.status(response.Code).json(response.Message);
            } catch (e) {
                console.log(e);
            }
            return false;
        }
        return true
    }

}

module.exports = VerificationHelper;
