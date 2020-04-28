'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    login: DataTypes.STRING,
    email: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    birthdate: DataTypes.DATE,
    active: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
