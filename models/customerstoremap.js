
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const customerstoremap = sequelize.define('customerstoremap', {

    id:{
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    idx: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    storeid: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    customerid:{
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    } 
    
}, {
    tableName: 'customerstoremap',
    freezeTableName: true,
    timestamps: false
});

module.exports = customerstoremap;
