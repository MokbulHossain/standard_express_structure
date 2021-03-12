
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const customer_otp = sequelize.define('customer_otp', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    msisdn: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at:{
        type: DataTypes.DATE,
        defaultValue:sequelize.literal("now()")
    },
    is_used:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    otp_attempts:{
        type: DataTypes.SMALLINT,
        defaultValue:0
    }
    
}, {
    tableName: 'customer_otp',
    freezeTableName: true,
    timestamps: false
});

module.exports = customer_otp;
