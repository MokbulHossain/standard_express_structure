
import DataTypes from 'sequelize'
import sequelize from '../config/database'

const statusconfig = sequelize.define('statusconfig', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    tablename:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    statustype:{
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    statuscolumn: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    statusdesc:{
        type: DataTypes.TEXT,
        allowNull: true
    }
    
}, {
    tableName: 'statusconfig',
    freezeTableName: true,
    timestamps: false
});

module.exports = statusconfig;
