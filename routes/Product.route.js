const { VerifyToken, VerifyandAuth, VerifyandAdmin } = require("./VerifyToken");
const ProductModel = require("../models/Product.model");
const router = require("express").Router();

//Create Product
router.post("/add", VerifyandAdmin, async (req, res) => {
  const newProduct = new ProductModel(req.body);

  try {
    const saveProduct = await newProduct.save();
    res.status(200).json(saveProduct);
  } catch (error) {
    res.status(500).json("Error While Creating Product");
  }
});

//Update Product
router.put("/:id", VerifyandAuth, async (req, res) => {
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Delete
router.delete("/:id", VerifyandAuth, async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Product Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All Products
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await ProductModel.find().sort({ _id: -1 }).limit(5);
    } else if (qCategory) {
      products = await ProductModel.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await ProductModel.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
