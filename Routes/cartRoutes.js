const express = require('express');
const router=express.Router();
const {addtoCart,getCart,deleteFromCart, deleteCart}=require("../controllers/cartController")
const authMiddleware=require("../middleware/authMiddleware")
router.post("/cart/add",authMiddleware,addtoCart);
router.get("/cart",authMiddleware, getCart);
router.delete("/cart/:productId",authMiddleware, deleteFromCart);
router.delete("/cart",authMiddleware, deleteCart);
module.exports = router;