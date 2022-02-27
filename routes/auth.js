const router = require("express").Router();
const User = require("../models/User.model");
const CryptoJS = require("crypto-js");
const Jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const registerUser = await newUser.save();
    res.status(201).json(registerUser);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong Credentials");

    const hash = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const Userpassword = hash.toString(CryptoJS.enc.Utf8);

    Userpassword !== req.body.password &&
      res.status(401).json("Wrong Credentials");

    const accesstoken = Jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT,
      {
        expiresIn: "3d",
      }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accesstoken });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
