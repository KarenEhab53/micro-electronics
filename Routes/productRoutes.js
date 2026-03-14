const express = require('express');
const router=express.Router()
const {addProduct,allProducts,updateProductPrice}=require("../controllers/productController");
const authMiddleware=require("../middleware/authMiddleware")
const uploadImageProduct=require("../middleware/uploadImage")

router.post("/product",authMiddleware,uploadImageProduct,addProduct);
router.get("/product",allProducts);
router.put("/updateprice/:id",updateProductPrice)
module.exports = router;