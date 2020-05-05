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

}

module.exports = UserController;
