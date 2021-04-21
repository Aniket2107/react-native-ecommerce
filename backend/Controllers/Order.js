const Order = require("../Models/Order");
const OrderItem = require("../Models/OrderItem");
const mongoose = require("mongoose");

exports.getAllOrders = async (req, res) => {
  const orderList = await Order.find().populate("user", "name email");

  if (!orderList)
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong, Try again" });

  return res.status(200).json({ success: true, data: orderList });
};

exports.getAOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: { path: "category" } },
    });

  if (!order)
    return res
      .status(404)
      .json({ success: false, msg: "No order found, Try again" });

  return res.status(200).json({ success: true, data: order });
};

exports.getTotalOrders = async (req, res) => {
  const totalOrds = await Order.countDocuments((count) => count);

  if (!totalOrds)
    return res.status(500).json({ success: false, msg: "No orders found" });

  return res.status(200).json({ success: true, data: totalOrds });
};

exports.getTotalSales = async (req, res) => {
  const totalSale = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSale)
    return res
      .status(404)
      .json({ success: false, msg: "No order found, Try again" });

  return res
    .status(200)
    .json({ success: true, data: totalSale.pop().totalsales });
};

exports.addOrder = async (req, res) => {
  //Create orderItems
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (item) => {
      let newOrderItem = new OrderItem({
        quantity: item.quantity,
        product: item.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const ordersItemsIds = await orderItemsIds;

  const totalPricesArray = await Promise.all(
    ordersItemsIds.map(async (item) => {
      const orderItem = await OrderItem.findById(item).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPricesArray.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: ordersItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    totalPrice: totalPrice,
    status: req.body.status,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });

  order = await order.save();

  if (!order)
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong, Try again" });

  return res
    .status(200)
    .json({ success: true, msg: "Order added", data: order });
};

exports.removeOrder = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (item) => {
          await OrderItem.findByIdAndRemove(item);
        });
        return res
          .status(200)
          .json({ success: true, msg: "Order deleted sucessfully" });
      } else {
        return res.status(404).json({ success: false, msg: "No order found" });
      }
    })
    .catch((err) => res.status(500).json({ success: false, msg: err }));
};

exports.updateOrder = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "Enter valid Id" });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!order)
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong, Try again" });

  return res
    .status(200)
    .json({ success: true, msg: "Order updated", data: order });
};
