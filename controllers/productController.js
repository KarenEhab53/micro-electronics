const Product = require("../Models/Product");
const User=require("../Models/User")
const addProduct = async (req, res) => {
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
};
const allProducts=async (req, res) => {
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
}
module.exports={
    addProduct,
    allProducts
}