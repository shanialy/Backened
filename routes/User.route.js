const { VerifyToken, VerifyandAuth, VerifyandAdmin } = require("./VerifyToken");
const CryptoJS = require("crypto-js");
const UserModel = require("../models/User.model");
const router = require("express").Router();

//Update User
router.put("/:id", VerifyandAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updateuser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateuser);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Delete
router.delete("/:id", VerifyandAuth, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json("User Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get
router.get("/:id", VerifyandAdmin, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ others });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All User
router.get("/", VerifyandAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await UserModel.find().sort({ _id: -1 }).limit(1)
      : await UserModel.find();
    // const { password, ...others } = users._doc;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get User Stats

router.get("/stats", VerifyandAdmin, async (req, res) => {
  const date = new Date();
  const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await UserModel.aggregate([
      { $match: { createdAt: { $gte: lastyear } } },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
