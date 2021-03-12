

import DataTypes from 'sequelize'
import sequelize from '../config/database'

const notification_template = sequelize.define('notification_template', {
    notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    keyword: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    notification_template: {
        type: DataTypes.STRING(320),
        allowNull: false,
        defaultValue:''
    },
    language: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue:''
    },
    templete_type: {
        type:  DataTypes.STRING(50),
        allowNull: false
    },
    hasunicode:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    created_by:{
        type:DataTypes.TEXT,
        allowNull: true
    },
    is_financial:{
        type:DataTypes.STRING(5),
        allowNull: true,
        defaultValue:'N'
    },
    sendsms:{
        type:DataTypes.STRING(1),
        allowNull: true,
        defaultValue:'N'
    },
    msgfor:{
        type:DataTypes.STRING(20),
        allowNull: true,
    }
    
}, {
    tableName: 'notification_template',
    freezeTableName: true,
    timestamps: false
});

module.exports = notification_template;
