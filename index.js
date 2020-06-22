require('dotenv').config();
const express = require('express');
const models = require('./models');
const routes = require('./routes');
const helper = require('./helpers').ExcelParserHelper;
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

async function bootstrap() {
    await models.sequelize.authenticate();
    await models.sequelize.sync();

    const app = express();
    app.use(fileUpload({
        createParentPath: true
    }));
    //await helper.parseExcelAndInsertInDatabase();
    app.use(bodyParser.urlencoded({extended: true}));
    routes(app);
    app.listen(3000, () => console.log(`Listening on 3000`));
}

bootstrap();
