const express =require("express");
const {handleUserSignup,handleUserLogin}=require("../controllers/user")
const router= express.Router();
router.post("/",handleUserSignup);
router.post("/login",handleUserLogin);

router.get("/login", (req, res) => {
    res.render("login"); // or res.send("Login Page");
});



module.exports=router;