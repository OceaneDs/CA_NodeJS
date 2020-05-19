const bodyParser = require('body-parser');
const AssoviationController = require('../controllers').AssociationController;
const Verification = require('../helpers').VerificationHelper;
const AuthMiddleware = require('../middlewares/auth.middleware');


module.exports = function (app) {
    /**
     *
     */
    app.get("/association/ban/:idAssociation", AuthMiddleware.isAdmin(), async (req, res) => {
            try {
                const annex = await AssoviationController.banAssociation(+req.params.idAssociation);
                res.status(200).json(annex);
            } catch (err) {
                res.status(409).json(err);
            }
        }
    )
    ;

};
