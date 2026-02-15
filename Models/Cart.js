const mongoose = require('mongoose');
const Product = require('./Product');
const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true,
    },
    quantity: { type: Number, required: true },
  },
  { timestamps: true },
);
const Cart= mongoose.model("Cart",cartSchema);
module.exports=Cart