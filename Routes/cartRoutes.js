const express = require('express');
const router=express.Router();
const {addtoCart,getCart}=require("../controllers/cartController")
router.put("/cart/:userId/add",addtoCart);
router.get("/cart/:userId", getCart);
module.exports = router;