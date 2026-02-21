const express = require('express');
const router=express.Router()
const {addProduct,allProducts}=require("../controllers/productController");
router.post("/product",addProduct);
router.get("/product",allProducts);
module.exports = router;