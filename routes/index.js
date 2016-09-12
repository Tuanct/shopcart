var express = require('express');
var router = express.Router();

var Product = require('../models/product');

router.get('/', function(req, res, next) {
	var products = Product.find(function(err, doc){
  		res.render('shop/index', {products: doc });
	});
});


module.exports = router;
