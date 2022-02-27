const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/User.route");
const productRoute = require("./routes/Product.route");
const orderRoute = require("./routes/Order.route");
const cartRoute = require("./routes/Cart.route");
const auth = require("./routes/auth");
const cors = require("cors");
const app = express();

dotenv.config();
mongoose
  .connect(process.env.MONGO_CON)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port 5000");
});
