'use strict';
module.exports = (sequelize, DataTypes) => {
    const Association = sequelize.define('Association', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        city: DataTypes.STRING
    }, {});
    Association.associate = function (models) {
        Association.hasMany(models.Annex);
    };
    return Association;
};
