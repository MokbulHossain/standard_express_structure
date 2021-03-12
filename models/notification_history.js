

import DataTypes from 'sequelize'
import sequelize from '../config/database'

const notification_history = sequelize.define('notification_history', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    destination_MSISDN: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    message_body: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue:sequelize.literal("(now() at time zone 'utc')")
    },
    status:{
        type: DataTypes.SMALLINT,
        defaultValue:0
    }
}, {
    tableName: 'notification_history',
    freezeTableName: true,
    timestamps: false
});

module.exports = notification_history;
