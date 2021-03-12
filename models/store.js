
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const store = sequelize.define('store', {
    storeid: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    storename: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    storepostcode: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    city:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    address:{
        type: DataTypes.TEXT,
        allowNull: false
    }
    
}, {
    tableName: 'store',
    freezeTableName: true,
    timestamps: false
});

module.exports = store;
