const bodyParser = require('body-parser');
const AnnexController = require('../controllers').AnnexController;
const Verification = require('../helpers').VerificationHelper;
const AuthMiddleware = require('../middlewares/auth.middleware');


module.exports = function (app) {
    /**
     * json example
     {
        name:annex
        email:annex@gmail.com
        street:221 baker street
        zipCode:87014
        city:Londres
        phone:0504020104
        associationId:1,
        "horaires":[
		{
			"idJour":1,
			"openingTime":"08:30",
			"closingTime":"11:30"
		},
		{
			"idJour":1,
			"openingTime":"08:30",
			"closingTime":"11:30"
		},
		{
			"idJour":1,
			"openingTime":"08:30",
			"closingTime":"11:30"
		},
		{
			"idJour":1,
			"openingTime":"08:30",
			"closingTime":"11:30"
		}
	]
        }
     */
    app.post('/annex/create', bodyParser.json(),AuthMiddleware.auth(), async (req, res) => {
        const {name, email, street, zipCode, city, phone, associationId,horaires} = req.body;
        const allRequireParams = Verification.allRequiredParam(name, email, street, zipCode, city, phone, associationId, res);
        if (!allRequireParams) {
            return;
        }
        const emailAlreadyExist = await Verification.emailAlreadyExiest(email, "annex", res);
        if (!emailAlreadyExist) {
            return;
        }
        try {
            const authorization = req.headers['authorization'];
            const user = await Verification.userFromToken(authorization.split(" ")[1]);
            const annex = await AnnexController.createAnnex(name, email, street, zipCode, city, phone, associationId,horaires,user);
            res.status(201).json(annex);
        } catch (err) {
            res.status(409).json(err);
        }
    });
    /**
     *
     */
    app.put("/annex/ban/:idAnnex",AuthMiddleware.isAdmin(),async (req,res)=>{
        try {
            const annex = await AnnexController.banAnnex(+req.params.idAnnex);
            res.status(200).json(annex);
        } catch (err) {
            res.status(409).json(err);
        }
    });

    /**
     *
     */
    app.put("/annex/validate/:idAnnex",AuthMiddleware.isAdmin(),async (req,res)=>{
        try {
            const annex = await AnnexController.validateAnnex(+req.params.idAnnex);
            res.status(200).json(annex);
        } catch (err) {
            res.status(409).json(err);
        }
    });
};
