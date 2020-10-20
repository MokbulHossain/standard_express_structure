const Orders = require('../models/Orders');
const OrderItem = require('../models/OrderItem');
const Products = require('../models/Products');
const StatusType = require('../models/StatusType');
const Zone = require('../models/Zone');


Orders.hasMany(OrderItem, {targetKey: 'order_id', foreignKey: 'order_id', as: 'Items'});
OrderItem.belongsTo(StatusType, {targetKey: 'id',foreignKey: 'status_id',as:'status'});
OrderItem.belongsTo(Products, {targetKey: 'product_id',foreignKey: 'product_id',as:'product'});



module.exports = {OrderItem,Orders,Products,StatusType,Zone};