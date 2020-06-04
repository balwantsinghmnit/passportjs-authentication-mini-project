const express = require("express");
const {checkAuthenticate,checkNotAuthenticate} = require("../config/auth");
const router = express.Router();

//first page 
router.get("/",checkNotAuthenticate,(req,res)=>{
	res.redirect("/user/register");
});

//dashboard
router.get("/dashboard",checkAuthenticate,(req,res)=>{
	res.render("dashboard",{name:req.user.name});
});

//logout
router.get("/logout",checkAuthenticate,(req,res)=>{
	req.flash("success_msg","You are successfully logged out");
	req.logout();
	res.redirect("/user/login");
});

module.exports = router;