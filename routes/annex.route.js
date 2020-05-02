const bodyParser = require('body-parser');
const AnnexController = require('../controllers').AnnexController;
const Verification = require('../helpers').VerificationHelper;


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
        associationId:1
        }
     */
    app.post('/annex/create', bodyParser.json(), async (req, res) => {
        const {name, email, street, zipCode, city, phone, associationId} = req.body;
        const allRequireParams = Verification.allRequiredParam(name, email, street, zipCode, city, phone, associationId, res);
        const emailAlreadyExist = Verification.emailAlreadyExiest(email, "annex",res);
        if (!emailAlreadyExist) return;
        if (!allRequireParams) return;
        try {
            const annex = await AnnexController.createAnnex(name, email, street, zipCode, city, phone, associationId);
            res.status(201).json(annex);
        } catch (err) {
            res.status(409).json(err);
            console.log(err)
        }
    });
};
