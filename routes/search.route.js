const bodyParser = require('body-parser');
const SearchController = require('../controllers').SearchController;
const AuthMiddleware = require('../middlewares/auth.middleware');

module.exports = function (app){


    app.get('/search/all/annexes', bodyParser.json(), AuthMiddleware.auth(), async (req, res) => {
        try {
            const allAnnexes = await SearchController.getAllAnnexes();
            res.status(200).json(allAnnexes);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });

    app.get('/search/all/associations', bodyParser.json(), AuthMiddleware.auth(), async (req, res) => {
        try {
            const allAssociations = await SearchController.getAllAssociations();
            res.status(200).json(allAssociations);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });
};
