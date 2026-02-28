const express = require('express');
const router=express.Router()
const {addProduct,allProducts,updateProductPrice}=require("../controllers/productController");
const authMiddleware=require("../middleware/authMiddleware")
router.post("/product",authMiddleware,addProduct);
router.get("/product",allProducts);
router.put("/updateprice/:id",updateProductPrice)
module.exports = router;