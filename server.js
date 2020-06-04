const express = require("express");
const userRouter = require("./routes/user");
const webRouter = require("./routes/index");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const layouts = require("express-ejs-layouts");
const passport = require("passport");
const User = require("./models/user");
const initialize = require("./config/passport-config");


//passport
initialize(passport);


//database connection
mongoose.connect("your mongo uri",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log("database connected")})
.catch((err)=>{console.log(err)});

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(layouts);
app.use(session({
	secret:"mysecret",
	resave:true,
	saveUninitialized:true
}));
app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine","ejs");


//global variables
app.use((req,res,next)=>{
	res.locals.success_msg=req.flash("success_msg");
	res.locals.error = req.flash("error");
	next();
});


app.use("/",webRouter);
app.use("/user",userRouter);


app.listen(5000,()=>{
	console.log(`server is running on port no 5000`);
});