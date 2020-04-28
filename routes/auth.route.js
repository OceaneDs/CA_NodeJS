const bodyParser = require('body-parser');
const AuthController = require('../controllers').AuthController;

module.exports = function(app) {

    app.post('/auth/subscribe', bodyParser.json(), async (req, res) => {
        const {login,firstname, email, lastname, password, passwordConfirm,street,zipCode,city,phone} = req.body;
        if(req.body.login && req.body.password && req.body.email) {
            try  {
                const user = await AuthController.subscribe(login,firstname, email, lastname, password,street,zipCode,city,phone);
                res.status(201).json(user);
            } catch(err) {
                res.status(409).end();
            }
        } else {
            res.status(400).end();
        }
    });

    app.post('/auth/login', bodyParser.json(), async (req, res) => {
        if(req.body.login && req.body.password) {
            try  {
                const session = await AuthController.login(req.body.login, req.body.password);
                if(session) {
                    res.status(201).json(session);
                } else {
                    res.status(401).end();
                }
            } catch(err) {
                res.status(500).end();
            }
        } else {
            res.status(400).end();
        }
    });

    app.delete('/auth/logout', async (req, res) => {

    });
};
