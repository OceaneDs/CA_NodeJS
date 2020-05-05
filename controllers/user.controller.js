const models = require('../models');
const User = models.User;

class UserController {

    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    static async banUser(userId){

        const user = await User.update({ active: false }, {
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
    static async validateUser(userId){

        const user = await User.update({ validForVolunteer: true }, {
            where: {
                id: userId
            }
        });
    }

}

module.exports = UserController;
