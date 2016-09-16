module.exports = function Cart(oldCart){
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty  || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item, id){
		var storedItem = this.items[id];
		if (!storedItem){
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.price;
	};

	this.edit = function(qty, id){
		var oldQty = this.items[id].qty;
		var oldPrice = this.items[id].price;
		this.items[id].qty = qty ;
		this.items[id].price = this.items[id].item.price * qty;
		this.totalQty = this.totalQty - oldQty + qty;
		this.totalPrice = this.totalPrice - oldPrice + this.items[id].price;
		 if ( this.items[id].qty <= 0){
		 	delete this.items[id];
		 }
	};

	this.delete = function(id){
		this.totalQty = this.totalQty - this.items[id].qty;
		this.totalPrice = this.totalPrice - this.items[id].price;
		delete this.items[id];
	};

	this.generateArray = function(){
		var arr = [];
		for (var id in this.items){
			arr.push(this.items[id]);
		}
		return arr;
	};
};