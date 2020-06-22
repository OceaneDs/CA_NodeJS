const models = require('../models');
const Type = models.Type;

class TypeController {
    /*async static add(token) {

    }*/

     static getAllTypes(){
        return Type.findAll();
    }
}

module.exports = TypeController;
