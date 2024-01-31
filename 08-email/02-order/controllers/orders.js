const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {user, request} = ctx;
  const {product, phone, address} = request.body;

  const order = await Order.create({
    user: user.id,
    product,
    phone,
    address,
  });

  await order.populate('product');

  await sendMail({
    to: user.email,
    subject: 'Подтверждение заказа',
    locals: order,
    template: 'order-confirmation',
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const {user} = ctx;
  const orders = await Order.find({user: user.id});

  ctx.body = {orders: orders.map(mapOrder)};
};
