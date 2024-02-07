'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cartProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({products}) {
      // define association here
      this.belongsTo(products, {foreignKey : "productId"})
    }
  }
  cartProducts.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    productId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references : {
        model : "products",
        key : "id"
      }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references : {
        model : "users",
        key : "id"
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'cartProducts',
  });
  return cartProducts;
};