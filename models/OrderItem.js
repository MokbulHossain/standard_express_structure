
const DataTypes = require("sequelize");
const sequelize = require('../config/database').pg;

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
     product_quantity:{type: DataTypes.FLOAT},
     product_discount:{type: DataTypes.FLOAT},
     total_price:{type: DataTypes.FLOAT},
     status_id: {
        type: DataTypes.TINYINT
    }
}, {
    tableName: 'order_product',
    freezeTableName: true,
    timestamps: false
});

module.exports = OrderItem;
