var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');

router.get('/', function(req, res, next) {
	req.session.oldUrl = req.url;
	var successMsg = req.flash('success')[0];
	var products = Product.find(function(err, doc){
  		res.render('shop/index', {products: doc, noMessage: !successMsg,successMsg: successMsg });
	}).sort({title: 1});
});

router.get('/detail/:id', function(req, res, next) {
	var productId = req.params.id;
	req.session.oldUrl = req.url;
	var product = Product.findOne({"_id": productId},function(err, doc){
  		res.render('shop/detail', {product: doc});
	});
});

router.get('/add-to-cart/:id', function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product){
		if (err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
	  	req.flash('success', "Added to cart!");
		res.redirect(req.session.oldUrl);
	});
});

router.get('/edit-cart/:id', function(req, res, next){
	var qty = req.query.qty;
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart: {});

	cart.edit(qty, productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart/');
});

router.get('/delete-item-cart/:id', function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart: {});

	cart.delete(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart/');
});

router.get('/shopping-cart', function(req, res, next){
	if (!req.session.cart) {
		return res.render('shop/shopping-cart',{products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next){
	if (!req.session.cart) {
		return res.render('shop/shopping-cart');
	}	 
	var cart = new Cart(req.session.cart);
	var errMsg = req.flash('error')[0];
	res.render('shop/checkout', {total: cart.totalPrice, errMsg : errMsg, noErrors: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next){
	if (!req.session.cart) {
		return res.render('shop/shopping-cart');
	}	
	var cart = new Cart(req.session.cart);

	var stripe = require("stripe")(
	  "sk_test_swjJFCbKFeeg4H7EfZeME4fC"
	);

	stripe.charges.create({
	  amount: cart.totalPrice*1000,
	  currency: "vnd",
	  source: req.body.stripeToken, // obtained with Stripe.js
	  description: "Test Change"
	}, function(err, charge) {
	  	if (err){
	  		req.flash('error', err.message);
	  		return res.redirect('/checkout');
	  	}
	  	var order = new Order({
	  		user: req.user,
	  		cart: cart,
	  		address: req.body.address,
	  		name: req.body.name,
	  		paymentId: charge.id
	  	});
	  	order.save(function(err, result){
	  		req.flash('success', "Successfully bought product!");
		  	req.session.cart = null;
		  	res.redirect('/');
	  	});
	});
});

module.exports = router;

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	req.session.oldUrl = req.url;
	res.redirect('/user/signin');
}