
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const customerauthentication = sequelize.define('customerauthentication', {

    idx: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    mobile: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    //4 digit pin only...
    password:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    retry:{
        type: DataTypes.SMALLINT,
        defaultValue:0
    },
    customerstatus:{
        type: DataTypes.SMALLINT,
        defaultValue:0
    }
    
}, {
    tableName: 'customerauthentication',
    freezeTableName: true,
    timestamps: false
});

module.exports = customerauthentication;
