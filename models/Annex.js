'use strict';
module.exports = (sequelize, DataTypes) => {
    const Annex = sequelize.define('Annex', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        street: DataTypes.STRING,
        city: DataTypes.STRING,
        phone: DataTypes.INTEGER,
        active: DataTypes.BOOLEAN,
    }, {});
    Annex.associate = function(models) {
        Annex.belongsTo(models.Association);
    };
    return Annex;
};
