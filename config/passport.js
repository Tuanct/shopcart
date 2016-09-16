var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require('passport-local').Strategy;
 
passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err,user){
		done(err, user);
	});
});

passport.use('local.signup', new LocalStrategy ({
	usernameField : 'email',
    passwordField : 'password',
    telField : 'tel',
    addressField : 'address',
    nameField : 'name',
    passReqToCallback : true
},function(req, email, password, done){
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 6, max : 20});
	req.checkBody('tel', 'Tel is too long.').notEmpty().isLength({max : 13});
	req.checkBody('address', 'Address is too long.').notEmpty().isLength({max : 50});
	req.checkBody('name', 'Name is too long.').notEmpty().isLength({max : 30});
	var errors = req.validationErrors();
	if (errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user){
		if (err){
			return done(err);
		}
		if (user){
			return done(null, false, {message: 'Email is already in use!'});
		}

		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encrytpPassword(password);
		newUser.name = req.body['name'];
		newUser.address = req.body['address'];
		newUser.tel = req.body['tel'];
		newUser.save(function(err, result){
			if (err){
				return done(err);
			}
			return done(null, newUser);
		});
	});
}));

passport.use('local.signin', new LocalStrategy({
	usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},function(req, email, password, done){
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty();
	var errors = req.validationErrors();
	if (errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user){
		if (err){
			return done(err);
		}
		if (!user){
			return done(null, false, {message: 'No user found!'});
		}
		if (!user.validPassword(password)){
			return done(null, false, {message: 'Wrong password'});
		}

		return done(null, user);
	});
}));