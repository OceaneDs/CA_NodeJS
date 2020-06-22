module.exports = function(sequelize, DataTypes) {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        }
    }, {});
    Product.associate = (models) => {
        Product.belongsTo(models.Type);
    };
    return Product;
};
