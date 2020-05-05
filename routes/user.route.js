const bodyParser = require('body-parser');
const UserController = require('../controllers').UserController;
const AuthMiddleware = require('../middlewares/auth.middleware');


module.exports = function (app) {
    /**
     *
     */
    app.put("/user/ban/:idUser",AuthMiddleware.isAdmin(),async (req,res)=>{
        try {
            const annex = await UserController.banUser(+req.params.idUser);
            res.status(200).json(annex);
        } catch (err) {
            res.status(409).json(err);
        }
    });

    /**
     *
     */
    app.put("/user/validate/:idUser",AuthMiddleware.isAdmin(),async (req,res)=>{
        try {
            const annex = await UserController.validateUser(+req.params.idUser);
            res.status(200).json(annex);
        } catch (err) {
            res.status(409).json(err);
        }
    });
};
