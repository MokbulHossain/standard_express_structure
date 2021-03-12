
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const checkinlog = sequelize.define('checkinlog', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    idx: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    storeid: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    checkindate:{
        type: DataTypes.DATE,
        defaultValue:sequelize.literal("now()")
    },
    checkintime:{
        type: DataTypes.DATE,
        defaultValue:sequelize.literal("now()")
    },
    checkouttime:{
        type: DataTypes.DATE,
        defaultValue:sequelize.literal("now()")
    }
    
}, {
    tableName: 'checkinlog',
    freezeTableName: true,
    timestamps: false
});

module.exports = checkinlog;
