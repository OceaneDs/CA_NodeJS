require('dotenv').config();
const express = require('express');
const models = require('./models');
const routes = require('./routes');

async function bootstrap() {
    await models.sequelize.authenticate();
    await models.sequelize.sync();

    const app = express();
    routes(app);
    app.listen(3000, () => console.log(`Listening on 3000`));
}

bootstrap();
