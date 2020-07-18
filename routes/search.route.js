const bodyParser = require('body-parser');
const SearchController = require('../controllers').SearchController;
const AuthMiddleware = require('../middlewares/auth.middleware');
//sconst {Sequelize} = require('sequelize');

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

    app.get('/search/all/User', bodyParser.json(), AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const allUsers = await SearchController.getAllUsers();
            res.status(200).json(allUsers);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });

    app.get('/search/all/AnnexAvailability', bodyParser.json(), AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const allAnnexAvailabilities = await SearchController.getAllAnnexAvailabilities();
            res.status(200).json(allAnnexAvailabilities);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });

    app.get('/search/all/Day', bodyParser.json(), AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const allDays = await SearchController.getAllDays();
            res.status(200).json(allDays);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });

    app.get('/search/all/Image', bodyParser.json(), AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const allImages = await SearchController.getAllImages();
            res.status(200).json(allImages);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });

    app.get('/search/all/Report', bodyParser.json(), AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const allReports = await SearchController.getAllReports();
            res.status(200).json(allReports);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });

    app.get('/search/all/Role', bodyParser.json(), AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const allRoles = await SearchController.getAllRoles();
            res.status(200).json(allRoles);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });

    app.get('/search/all/Service', bodyParser.json(), AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const allServices = await SearchController.getAllServices();
            res.status(200).json(allServices);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });


    app.get('/search/all/:table',AuthMiddleware.isAdmin(), async (req, res) => {
        try {
            const tableData = await Sequelize.query("SELECT * FROM `" + table + "`", {type: QueryTypes.SELECT});
            res.status(200).json(tableData);
        } catch (err) {
            console.log(err);
            res.status(409).json(err);
        }
    });
    app.post('/search/all/needs', bodyParser.json(), async  (req, res) => {
        if(req.body.name) {
            try {
                const needList = await SearchController.searchNeed(req.body.name);
                res.status(201).json(needList);
            } catch (err) {
                console.log(err)
                res.status(409).end();
            }
        } else {
            res.status(400).end();
        }
    });
};
