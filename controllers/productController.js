const Product = require("../Models/Product");
const User = require("../Models/User");
const {
  addProductSchema,
} = require("../controllers/Validation/productValidation");
const addProduct = async (req, res) => {
  try {
      const { error, value } = addProductSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    const userId = req.user.id;
    const { name, price, stock } = value;
    if (!req.file) return res.status(400).json({ msg: "please add product image" });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can add product" });
    }
    // return console.log(req.file.path);
    
    value.image = req.file.path;
    const product = await Product.create(value);

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
const allProducts = async (req, res) => {
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
};

const updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPrice } = req.body;

    // missing await
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // missing defined discountPrice before if
    let discountPrice;
    if (newPrice > 1000) {
      discountPrice = newPrice * 0.9;
    }

    // define priceToUpdate using discountPrice if exists, else newPrice
    const priceToUpdate = discountPrice || newPrice;

    // update product price
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { price: priceToUpdate },
      { new: true }, // return the updated document
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  allProducts,
  updateProductPrice,
};
