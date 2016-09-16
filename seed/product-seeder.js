var Product = new require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopcart');
var products =[ 
	new Product ({
		imagePath: "6.jpg",
		title: "Harry Potter 6",
		description: "arry Potter và Hoàng tử lai (tiếng Anh: Harry Potter and the Half-Blood Prince) là quyển sách thứ sáu trong bộ sách giả tưởng nổi tiếng Harry Potter của tác giả J.K. Rowling..",
		price: 22,
	}),
	new Product ({
		imagePath: "7.jpg",
		title: "Harry Postter 7",
		description: "Harry Potter và Bảo bối Tử thần (nguyên tác tiếng Anh: Harry Potter and the Deathly Hallows) là cuốn sách thứ bảy và cũng là cuối cùng của bộ tiểu thuyết giả tưởng Harry Potter của nhà văn Anh J.K. Rowling. ",
		price: 23,
	}),
];

var d = 0;
for (var i = 0; i < products.length ; i++){
	products[i].save(function(err, result){
		d++;
		if ( d == products.length){
			exit();
		}
	}); 
}
function exit(){
	mongoose.disconnect();
}
