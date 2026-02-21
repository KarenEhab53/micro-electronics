const express = require('express');
const router=express.Router()
const {createUser,userLogin,userGet}=require("../controllers/userController")
router.post("/register",createUser);
router.post("/login",userLogin);
router.get("/users",userGet);
module.exports = router;