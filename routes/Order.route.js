const { VerifyToken, VerifyandAuth, VerifyandAdmin } = require("./VerifyToken");
const OrderModel = require("../models/Order.model");
const router = require("express").Router();

//Create Order
router.post("/add", VerifyToken, async (req, res) => {
  const newOrder = new OrderModel(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json("Error While Creating Order");
  }
});

//Update Cart
router.put("/:id", VerifyandAdmin, async (req, res) => {
  try {
    const updateOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Delete
router.delete("/:id", VerifyandAdmin, async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Order Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get user Order
router.get("/:userId", VerifyandAuth, async (req, res) => {
  try {
    const getOrder = await OrderModel.find({ userId: req.params.userId });
    res.status(200).json(getOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All Orderss
router.get("/", VerifyandAdmin, async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Monthly Income
router.get("/income", VerifyandAdmin, async (req, res) => {
  const date = new Date();
  const lastmonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousmonth = new Date(new Date.setMonth(lastmonth.getMonth() - 1));

  try {
    const income = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: previousmonth } } },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
