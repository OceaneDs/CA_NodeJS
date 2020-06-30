const bodyParser = require('body-parser');
const AuthMiddleware = require('../middlewares/auth.middleware');
const Verification = require('../helpers').VerificationHelper;
const ServiceController = require('../controllers').ServiceController;


module.exports = function(app) {


    app.post("/user/:idUser/answer/service/:idService", AuthMiddleware.isVolunteer(), async (req, res) => {
        try {
            const service = await ServiceController.answerService(req.params.idUser, req.params.idService);
            res.status(201).json(service);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });

    app.post("/annex/service/:idAnnex", bodyParser.json(), AuthMiddleware.isManager(), async (req, res) => {
        try {
            const service = await ServiceController.createService(req.params.idAnnex, req.body.nom, req.body.date_service, req.body.description,
                req.body.quantite, req.body.status, req.body.actif);
            res.status(201).json(service);
        } catch (err) {
            res.status(409).json(err);
            console.log(err);
        }
    });

    app.put("/annex/service/complete/:idService", AuthMiddleware.isManager(), async (req, res) => {
        try {
            const service = await ServiceController.completeService(req.params.idService);
            res.status(200).json(service);
        } catch (err) {
            res.status(409).json(err);
            console.log(err);
        }
    });

    app.put("/annex/service/delete/:idService", AuthMiddleware.isManager(), async (req, res) => {
        try {
            const service = await ServiceController.deleteService(req.params.idService);
            res.status(200).json(service);
        } catch (err) {
            res.status(409).json(err);
            console.log(err);
        }
    });

    app.get("/annex/:idAnnex/service/list", AuthMiddleware.auth(), async (req, res) => {
        try {
            const authorization = req.headers['authorization'];
            const user = await Verification.userFromToken(authorization.split(" ")[1]);
            const services = await ServiceController.getSeviceList(req.params.idAnnex, user);
            res.status(400).json(services);
        } catch (e) {
            res.status(400).json(e)
        }
    });

};
