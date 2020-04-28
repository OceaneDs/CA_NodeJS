const models = require('../models');
const User = models.User;
const bcrypt = require("bcrypt");

class AuthController {

    /**
     * @param login
     * @param email
     * @param password
     * @returns {Promise<User>}
     */
    static async subscribe(login, firstname, email, lastname, password, street, zipCode, city, phone) {
        return User.create({
            login,
            firstname,
            email,
            lastname,
            street,
            zipCode,
            city,
            phone,
            password: await bcrypt.hash(password, 10),
        });
    }

    /**
     * @param login
     * @param password
     * @returns {Promise<Session|null>}
     */
    static async login(login, password) {
        const user = await User.findOne({
            where: {
                login,
                password: SecurityUtil.hashPassword(password)
            }
        });
        if (!user) {
            return null;
        }
        const token = await SecurityUtil.randomToken();
        const session = await Session.create({
            token
        });
        await session.setUser(user);
        return session;
    }

    static userFromToken(token) {
        return User.findOne({
            include: [{
                model: Session,
                where: {
                    token
                }
            }]
        });
    }
}

module.exports = AuthController;
