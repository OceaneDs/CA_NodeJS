'use strict';
module.exports = (sequelize, DataTypes) => {
    const Donation = sequelize.define('Donation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        actif: DataTypes.BOOLEAN,
    }, {});
    Donation.associate = function (models) {
        Donation.hasMany(models.Requerir, {eager: true});
        Donation.belongsTo(models.Annex);
        Donation.belongsToMany(models.User, {through: 'repondre'});
    };
    return Donation;
};
