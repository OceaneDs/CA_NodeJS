const bodyParser = require('body-parser');
const UserController = require('../controllers').UserController;
const AuthMiddleware = require('../middlewares/auth.middleware');
const Verification = require('../helpers').VerificationHelper;


module.exports = function (app) {
    /**
     *
     */
    app.put("/user/ban/:idUser", AuthMiddleware.isAdmin(), async (req, res) => {
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
    app.put("/user/validate/:idUser", AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const annex = await UserController.validateUser(+req.params.idUser);
            res.status(200).json(annex);
        } catch (err) {
            res.status(409).json(err);
        }
    });

    app.get('/user/report/:idUser/:idAnnex', AuthMiddleware.isManager(), async (req, res) => {
        try {
            const response = await UserController.reportUser(req.params.idAnnex, req.params.idUser);
            res.status(201).json(response);
        } catch (err) {
            console.log(err)
            res.status(409).json(err);
        }
    });

    app.put('/user/update/:idUser', bodyParser.json(), AuthMiddleware.auth(), async (req, res) => {
        let {login, firstname, email, lastname, street, zipCode, city, phone, roleId, birthdate} = req.body;
        try {
            const allRequireParams = Verification.allRequiredParam(login, firstname, email, lastname, street, zipCode, city, phone, roleId, birthdate, res);
            if (!allRequireParams) {
                return;
            }

            const authorization = req.headers['authorization'];
            const userfromId = await Verification.userFromId(req.params.idUser);
            const userFromTOken = await Verification.userFromToken(authorization.split(" ")[1]);
            if (userFromTOken && userfromId) {
                if (userFromTOken.id !== userfromId.id && userFromTOken.RoleId !== 3) {
                    res.status(200).json("nope");
                    return;
                }
            }
            let loginAllreadyExist;
            if (login !== userfromId.login) {
                loginAllreadyExist = await Verification.loginAlreadyExiest(login, res);
                if (!loginAllreadyExist) {
                    return;
                }
            }
            let emailAlreadyExist;
            if (email !== userfromId.email) {
                emailAlreadyExist = await Verification.emailAlreadyExiest(email, "user", res);
                if (!emailAlreadyExist) {
                    return;
                }
            }
            let link;
            if (userfromId.RoleId === 1 && roleId === 2) {
                let pieceIdentity;
                if (req.files == null) {
                    res.status(400).json("Veuillez uploader une piece d'identité");
                    return;
                }
                pieceIdentity = req.files.pieceIdentite;
                await pieceIdentity.mv(process.env.uploadFile + pieceIdentity.name);
                link = process.env.uploadFile + pieceIdentity.name;
            } else if (userfromId.RoleId === 2 && roleId !== 1 || roleId === 2) {
                roleId = userfromId.RoleId;
            } else {
                if (userFromTOken.RoleId === 3) {
                    roleId = roleId;
                } else if (userfromId.RoleId === 4) {
                    roleId = 4;
                } else {
                    roleId = 1;
                }
            }
            const response = await UserController.updateUser(login, firstname, email, lastname, street, zipCode, city, phone, roleId, birthdate, link, req.params.idUser);
            res.status(200).json(response);
        } catch (err) {
            res.status(409).json(err);
        }
    });
};
