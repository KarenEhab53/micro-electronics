const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: {
    type: String,
    required: true,
    min: 0,
  },
  quantity: {
    type: String,
    required: true,
    min: 0,
  },
  stock: { type: String, enum: ["in stock", "out of the stock"], default: "stock" },
});
const Product = mongoose.model("Product",productSchema);
module.exports=Product;