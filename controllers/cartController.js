const Cart = require("../Models/Cart");
const addtoCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    // Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    //if product out of the stock
    if (product.stock == "out of the stock") {
      return res
        .status(400)
        .json({ msg: `the product : ${product.name} is out of the stock ` });
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
};
const getCart = async (req, res) => {
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
};
module.exports={
    addtoCart,
    getCart
}