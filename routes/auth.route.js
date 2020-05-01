const bodyParser = require('body-parser');
const AuthController = require('../controllers').AuthController;
const Verification = require('../helpers').VerificationHelper;


module.exports = function (app) {
    /**
     * json example
     {
        login:fnestan
        firstname:frantz
        email:frantzunestan@gmail.com
        lastname:nestan
        password:password
        passwordConfirm:password
        street:221 baker street
        zipCode:87014
        city:Londre
        phone:0504020104
        birthdate:1996-09-19
        roleId:1
        }
     */
    app.post('/auth/subscribe', bodyParser.json(), async (req, res) => {
        const {login, firstname, email, lastname, password, passwordConfirm, street, zipCode, city, phone, roleId, birthdate} = req.body;
        const allRequireParams = Verification.allRequiredParam(login, firstname, email, lastname, password, passwordConfirm, street, zipCode, city, phone, roleId, res);
        const emailAlreadyExist = Verification.emailAlreadyExiest(email, res);
        const loginAllreadyExist = Verification.loginAlreadyExiest(login, res);
        const passwordConfirmationIsGoog = Verification.passwordCormimationGood(password, passwordConfirm, res);
        if (!allRequireParams) return;
        if (!emailAlreadyExist) return;
        if (!loginAllreadyExist) return;
        if (!passwordConfirmationIsGoog) return;
        let pieceIdentity;
        let link;
        if (roleId == 2) {
            if (req.files == null) {
                res.status(400).json("Veuillez uploader une piece d'identité");
                return;
            }
            pieceIdentity = req.files.pieceIdentite;
            await pieceIdentity.mv(process.env.uploadFile + pieceIdentity.name);
            link = process.env.uploadFile + pieceIdentity.name;

        }
        try {
            const user = await AuthController.subscribe(login, firstname, email, lastname, password, street, zipCode, city, phone, roleId, birthdate, link);
            res.status(201).json(user);
        } catch (err) {
            res.status(409).json(err);
        }
    });

    /**
     *
     {
        login:fnestan
        password:password
     }
     */
    app.post('/auth/login', bodyParser.json(), async (req, res) => {
        const allRequiredParams = Verification.allRequiredParam(req.body.login, req.body.password, res);
        if (!allRequiredParams) return;
        try {
            const user = await AuthController.login(req.body.login, req.body.password);
            res.status(200).json(user);
        } catch (err) {
            res.status(500).end();
        }
    });
};
