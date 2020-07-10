const bodyParser = require('body-parser');
const DonationController = require('../controllers').DonationController;
const Verification = require('../helpers').VerificationHelper;
const AuthMiddleware = require('../middlewares/auth.middleware');
const DonnationController = require("../controllers/donation.controller");

module.exports = function (app) {

    // create a donation
    app.post("/donation/:idAnnex", bodyParser.json(), async (req, res) => {
        try {
            const donation = await DonnationController.createDonation(req.body.name, req.body.description,req.body.productRequest, req.params.idAnnex);
            res.status(201).json(donation);
        } catch (err) {
            res.status(409).json(err);
            console.log(err);
        }
    });

    app.put("/donation/complete/:idDonation", AuthMiddleware.isManager(), async (req, res) => {
        try{
            const donation = await DonationController.completeDonation(req.params.id);
            res.status(200).json(donation);
        }catch(err){
            res.status(409).json(err);
            console.log(err);
        }
    });

    app.put("/annex/donation/delete/:idDonation", AuthMiddleware.isManager(), async (req, res) => {
        try{
            const donation = await DonationController.deleteDonation(req.params.id);
            res.status(200).json(donation);
        }catch(err){
            res.status(409).json(err);
            console.log(err);
        }
    });
};
