const VerificationHelper = require('../helpers').VerificationHelper;

class AuthMiddleware {

    static auth() {
        return async function(req, res, next) {
            const authorization = req.headers['authorization'];
            if(!authorization || !authorization.startsWith('Bearer ')) {
                res.status(401).end();
                return;
            }
            const token = authorization.slice(7);
            const user = await VerificationHelper.userFromToken(token);
            if(!user) {
                res.status(403).json("Vous devez être connecter pour créer une association");
                return;
            }
            next();
        };
    }
    static isAdmin(){
        return async function(req, res, next) {
            const authorization = req.headers['authorization'];
            if(!authorization || !authorization.startsWith('Bearer ')) {
                res.status(401).end();
                return;
            }
            const token = authorization.slice(7);
            const user = await VerificationHelper.userFromToken(token);
            if(!user) {
                res.status(403).json("Vous devez être connecter");
                return;
            }
            const role = await user.getRole();
            if (role.name !== "Administrateur"){
                res.status(403).json("Vous n'avez pas le droit pour effectuer cette action");
                return;
            }
            next();
        }
    }

    static isManager(){
        return async function(req, res, next) {
            const authorization = req.headers['authorization'];
            if(!authorization || !authorization.startsWith('Bearer ')) {
                res.status(401).end();
                return;
            }
            const token = authorization.slice(7);
            const user = await VerificationHelper.userFromToken(token);
            if(!user) {
                res.status(403).json("Vous devez être connecter");
                return;
            }
            const role = await user.getRole();
            if (role.name !== "Gerant"){
                res.status(403).json("Vous n'avez pas le droit pour effectuer cette action");
                return;
            }
            next();
        }
    }
}

module.exports = AuthMiddleware;
