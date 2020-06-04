const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

function initialize(passport)
{
	passport.use(new localStrategy({usernameField:'email'},(email,password,done)=>{
		User.findOne({email:email})
		.then((user)=>{
			if(!user)
			{
				return done(null,false,{message:"This email is not registered"});
			}
			else
			{
				bcrypt.compare(password,user.password,(err,matched)=>{
					if(err) throw err;
					if(matched)
					{
						return done(null,user);
					}
					else
					{
						return done(null,false,{message:"Wrong Password"});
					}
				});
			}
		})
		.catch((err)=>{console.log(err)});
	}));

	passport.serializeUser((user,done)=>{
		done(null,user.id);
	});
	passport.deserializeUser((id,done)=>{
		User.findById(id,(err,user)=>{
			done(err,user);
		});
	});
}

module.exports = initialize;