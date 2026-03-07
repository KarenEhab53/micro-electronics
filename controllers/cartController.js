const Cart = require("../Models/Cart");
const Product = require("../Models/Product");

// ===================== ADD TO CART =====================
const addtoCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;


    // Find the product
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, msg: "Product not found" });

    if (product.stock < quantity)
      return res
        .status(400)
        .json({ success: false, msg: `Only ${product.stock} left in stock` });

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, products: [] });

    // Find if product already in cart
    const index = cart.products.findIndex((item) =>
      item.productId.equals(productId),
    );

    if (index > -1) {
      // Update quantity
      cart.products[index].quantity += quantity;
    } else {
      // Add new product to cart
      cart.products.push({ productId, quantity });
    }

    // Update product stock
    product.stock -= quantity;
    await product.save();
    await cart.save();

    res.json({
      success: true,
      msg: "Product added to cart successfully",
      data: cart,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: `Server error: ${err.message}` });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "name price",
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        msg: "Cart not found",
      });
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
    });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        msg: "Cart not found",
      });
    }

    const initialLength = cart.products.length;

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId,
    );

    if (cart.products.length === initialLength) {
      return res.status(404).json({
        success: false,
        msg: "Product not found in cart",
      });
    }

    await cart.save();

    res.json({
      success: true,
      msg: "Product removed from cart",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        msg: "Cart not found",
      });
    }

    cart.products = [];
    await cart.save();

    res.json({
      success: true,
      msg: "All items removed from cart",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

module.exports = {
  addtoCart,
  getCart,
  deleteFromCart,
  deleteCart,
};
