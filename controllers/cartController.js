const Cart = require("../Models/Cart");
const Product = require("../Models/Product");

// ===================== ADD TO CART =====================
const addtoCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Validate quantity
    const qtyToAdd = parseInt(quantity);

    if (!qtyToAdd || qtyToAdd <= 0) {
      return res.status(400).json({
        success: false,
        msg: "Quantity must be a positive number",
      });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });

    if (product.stock <= 0)
      return res.status(400).json({
        success: false,
        msg: `The product ${product.name} is out of stock`,
      });

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, products: [] });

    const existingProduct = cart.products.find(
      (item) => item.productId.toString() === productId,
    );

    const currentQty = existingProduct ? existingProduct.quantity : 0;

    // Prevent exceeding stock
    if (currentQty >= product.stock) {
      return res.status(400).json({
        success: false,
        msg: `No more ${product.name} available in stock.`,
      });
    }

    if (currentQty + qtyToAdd > product.stock) {
      return res.status(400).json({
        success: false,
        msg: `Cannot add ${qtyToAdd}. Only ${
          product.stock - currentQty
        } left in stock.`,
      });
    }

    // Add or update product in cart
    if (existingProduct) {
      existingProduct.quantity += qtyToAdd;
    } else {
      cart.products.push({ productId, quantity: qtyToAdd });
    }

    await cart.save();

    res.json({
      success: true,
      msg: "Product added to cart successfully",
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
