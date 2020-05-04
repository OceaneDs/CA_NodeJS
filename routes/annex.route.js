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
        const emailAlreadyExist = await Verification.emailAlreadyExiest(email, "annex", res);
        console.log(emailAlreadyExist);
        if (!emailAlreadyExist) {
            return;
        }
        if (!allRequireParams) {
            return;
        }
        try {
            const annex = await AnnexController.createAnnex(name, email, street, zipCode, city, phone, associationId,horaires);
            res.status(201).json(annex);
        } catch (err) {
            res.status(409).json(err);
        }
    });
};
