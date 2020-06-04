const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const passport = require("passport");
const {checkAuthenticate,checkNotAuthenticate} = require("../config/auth");

const router = express.Router();

//register page
router.get("/register",checkNotAuthenticate,(req,res)=>{
	res.render("register");
});

//login page
router.get("/login",checkNotAuthenticate,(req,res)=>{
	res.render("login");
});

//registration handling
router.post("/register",(req,res)=>{
	const {name,email,password1,password2} = req.body;

	if(!name || !email || !password1 || !password2)
	{
		return res.render("register",{error_msg:"Please fill all the fields"});
	}
	if(password1.length<8)
	{
		return res.render("register",{error_msg:"Password must have atleast 8 characters"});
	}
	if(password1!=password2)
	{
		return res.render("register",{error_msg:"Password don't match"});		
	}
	User.findOne({email:email})
	.then(user=>{
		if(user)
		{
			return res.render("register",{error_msg:"This email is already registered"});
		}
		else
		{
			bcrypt.genSalt(10,(err,salt)=>{
				if(err) throw err;
				bcrypt.hash(password1,salt,(err,hashed)=>{
					if(err) throw err;
					const newUser = new User({
						name,
						email,
						password:hashed
					});
					newUser.save()
					.then(user=>{
						req.flash("success_msg","You registered successfully and can login now");
						res.redirect("/user/login");
					})
					.catch((err)=>{
						console.log(err);
					})
				});
			});
		}
	});
});


//login handling using passport js
router.post("/login",(req,res,next)=>{
	passport.authenticate('local',{
		successRedirect:"/dashboard",
		failureRedirect:"/user/login",
		failureFlash:true
	})(req,res,next);
});

module.exports = router;