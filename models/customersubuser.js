
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const customersubuser = sequelize.define('customersubuser', {
    mobileno: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    email:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    idx: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    //4 digit pin..
    pin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userstatus:{
        type: DataTypes.SMALLINT,
        defaultValue:0
    }
    
}, {
    tableName: 'customersubuser',
    freezeTableName: true,
    timestamps: false
});

module.exports = customersubuser;
