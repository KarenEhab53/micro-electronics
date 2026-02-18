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
//create user
app.post("/api/register", async (req, res) => {
  try {
    //get data
    const { username, email, password, role } = req.body;
    // validate data
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "missed data" });
    }
    const exitUser = await User.findOne({ email });
    if (exitUser) {
      return res.status(400).json({ msg: "account already exist" });
    }
    //create user
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    res.status(201).json({
      success: true,
      msg: "Done created user",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});

//login route post
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    // const authCode = Buffer.from(user._id.toString()).toString("base64");

    res.json({
      success: true,
      msg: "Login successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
//get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({ msg: "users not found" });
    }
    const count = await User.countDocuments();
    res.status(201).json({
      success: true,
      msg: "users fetched successfully",
      totalUsers: count,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
//route add product
app.post("/api/product", async (req, res) => {
  try {
    const { userId, name, price, quantity, stock } = req.body;

    if (!userId || !name || !price || !stock) {
      return res.status(400).json({ msg: "missing data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can add product" });
    }

    const product = await Product.create({ name, price, quantity, stock });

    res.status(201).json({
      success: true,
      msg: "Product added successfully",
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
//get products
app.get("/api/product", async (req, res) => {
  try {
    const { name } = req.query; // use query for GET
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // partial & case-insensitive match
    }

    const products = await Product.find(filter);

    if (products.length === 0) {
      return res.status(404).json({ msg: "Products not found" });
    }

    res.status(200).json({
      success: true,
      totalProducts: products.length,
      data: products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});


app.get("/api/cart/:userId", async (req, res) => {
  try {
        const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "name price ",
    );

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    res.json({
      success: true,
      msg: "Cart fetched successfully",
      data: cart,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
//update cart
app.put("/api/cart/:userId/add", async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    

    // Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });
//if product out of the stock
if(product.stock=="out of the stock"){
  return res.status(400).json({msg:`the product : ${product.name} is out of the stock `})
}
    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, products: [] });

    // Find existing product in cart
    const existingProduct = cart.products.find(
      (item) => item.productId.toString() === productId,
    );
    
    // Check stock
    const qtyToAdd = quantity || 1;
    const currentQty = existingProduct ? existingProduct.quantity : 0;
    if (currentQty + qtyToAdd > product.quantity) {
      return res.status(400).json({
        msg: `Cannot add ${qtyToAdd}. Only ${product.quantity - currentQty} left in stock.`,
      });
    }

    // Add or update product and quantity
    if (existingProduct) existingProduct.quantity += qtyToAdd;
    else cart.products.push({ productId, quantity: qtyToAdd });

    await cart.save();
    res.json({ success: true, msg: "Product added", data: cart });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
