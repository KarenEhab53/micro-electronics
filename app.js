require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
async function dbconnection() {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://127.0.0.1:27017/e-commerce",
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
dbconnection();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

//export models
const User = require("./Models/User");
const Product = require("./Models/Product");
const Cart = require("./Models/Cart");
// routes
const userRoutes=require("./Routes/userRoutes")
app.use("/api",userRoutes)

const productRoutes=require("./Routes/productRoutes")
app.use("/api",productRoutes)


const cartRoutes=require("./Routes/cartRoutes")
app.use("/api",cartRoutes)
