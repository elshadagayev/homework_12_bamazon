const Products = require("./my_modules/products");

const products = new Products();

products.getProducts(function(err, products){
	if(err)
		throw err;

	console.log("products list", products);
});

products.createNewProduct({
	name: 'aaa',
	price: 10,
	stock_qty: 2,
	department_id: 1
}, function(err, data){
	if(err)
		throw err;

	console.log("Product", data);
});