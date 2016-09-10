var Product = new require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopcart');
var products =[ 
	new Product ({
		imagePath: "poster.medium.jpg",
		title: "Harry Postter 1",
		description: "Harry Potter và Hòn Đá Phù Thủy là bộ phim đầu tiên trong series phim “Harry Potter” được xây dựng dựa trên tiểu thuyết của nhà văn J.K.Rowling.",
		price: 17,
	}),
	new Product ({
		imagePath: "2.jpg",
		title: "Harry Postter 2",
		description: "Harry Potter and the Chamber of Secrets is the second novel in the Harry Potter series, written by J. K. Rowling. ",
		price: 18,
	}),
	new Product ({
		imagePath: "3.jpg",
		title: "Harry Postter 3",
		description: "Harry Potter and the Prisoner of Azkaban is the third novel in the Harry Potter series, written by J. K. Rowling.",
		price: 19,
	}),
	new Product ({
		imagePath: "4.jpg",
		title: "Harry Postter 4",
		description: "Harry';s fourth year at Hogwarts is about to start and he is enjoying the summer vacation with his friends.",
		price: 20,
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
