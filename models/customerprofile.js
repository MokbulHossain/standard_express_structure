
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const customerprofile = sequelize.define('customerprofile', {
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
    mobile: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    businessname:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    ownername:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    companyregno:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    vatno:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    businessaddress:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    postcode:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    city:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    landline:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
    email:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    businesstype:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
    accstatus:{
        type: DataTypes.SMALLINT,
        defaultValue:0
    },
    registrtiondate:{
        type: DataTypes.DATE,
        defaultValue:sequelize.literal("now()")
    },
    approvedate:{
        type: DataTypes.DATE,
        allowNull: true
    },
    approveby:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    companyregdoc:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    vatdoc:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    EOID:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    FID:{
        type: DataTypes.TEXT,
        allowNull: true
    }
    
}, {
    tableName: 'customerprofile',
    freezeTableName: true,
    timestamps: false
});

module.exports = customerprofile;
