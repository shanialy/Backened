const { VerifyToken, VerifyandAuth, VerifyandAdmin } = require("./VerifyToken");
const Cart = require("../models/Cart.model");
const router = require("express").Router();

//Create Cart
router.post("/add", VerifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const saveCart = await newCart.save();
    res.status(200).json(saveCart);
  } catch (error) {
    res.status(500).json("Error While Creating Cart");
  }
});

//Update Cart
router.put("/:id", VerifyandAuth, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Delete
router.delete("/:id", VerifyandAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get user Cart
router.get("/find/:userId", VerifyandAuth, async (req, res) => {
  try {
    const getCart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(getCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All Products
router.get("/", VerifyandAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
