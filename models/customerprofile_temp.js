
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const customerprofile_temp = sequelize.define('customerprofile_temp', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    idx: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    mobile: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    businessname:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    ownername:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    companyregno:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    vatno:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    businessaddress:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    postcode:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    city:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    landline:{
        type: DataTypes.BIGINT,
        allowNull: true
    },
    email:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    businesstype:{
        type: DataTypes.BIGINT,
        allowNull: true
    },
    accstatus:{
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    registrtiondate:{
        type: DataTypes.DATE,
        allowNull: true
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
    }
    
}, {
    tableName: 'customerprofile_temp',
    freezeTableName: true,
    timestamps: false
});

module.exports = customerprofile_temp;
