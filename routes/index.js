var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');

router.get('/', function(req, res, next) {
	var products = Product.find(function(err, doc){
  		res.render('shop/index', {products: doc });
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
		// console.log(req.session.cart);
		res.redirect('/');
	});
});

router.get('/shopping-cart', function(req, res, next){
	if (!req.session.cart) {
		return res.render('shop/shopping-cart',{products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice});cart.generateArray();
});


module.exports = router;
