const MyDB = require("./my-db");
const Product = require("./product");

class Products {
	constructor () {

	}

	getProducts (callback) {
		let sql = `
			select p.id,
				   p.name,
				   p.department_id,
				   p.price,
				   (p.stock_qty - p.orders) stock_qty,
				   d.name department_name
			  from products p
			  left join departments d on d.id = p.department_id
		`;

		const products = [];

		MyDB.i().connection.query(sql, function(err, data) {
			if(err)
				return typeof callback !== 'function' ? null :callback(err, []);

			for (let i in data)
				products.push(new Product(data[i]));

			if(typeof callback === 'function')
				callback(err, products);
		});
	}

	getProduct (id, callback) {
		let sql = `select p.id,
				   p.name,
				   p.department_id,
				   p.price,
				   (p.stock_qty - p.orders) stock_qty,
				   d.name department_name
			  from products p
			  left join departments d on d.id = p.department_id
			 where p.id = ?`;

		MyDB.i().connection.query(sql, [id], function(err, data) {
			if(err)
				return typeof callback !== 'function' ? null :callback(err, new Product());

			if(typeof callback === 'function')
				callback(err, new Product(data[0]));
		});
	}

	createNewProduct (data, callback) {
		let sql = "insert into products set ?"

		MyDB.i().connection.query(sql, {
			name: data.name,
			stock_qty: data.stock_qty,
			price: data.price,
			department_id: data.department_id
		}, function(err,data){
			if(err)
				return typeof callback !== 'function' ? null :callback(err, null);

			if(typeof callback === 'function')
				callback(err, data);
		});
	}

	updateProduct(data, callback) {
		let sql = `update products 
					  set name = :name, 
					      stock_qty = :stock_qty, 
					      price = :price, 
					      department_id = :department_id,
					      orders = :orders
				    where id = :id`;

		MyDB.i().connection.query(sql, {
			name: data.name,
			stock_qty: data.stock_qty,
			price: data.price,
			department_id: data.department_id,
			orders: data.orders,
			id: data.id
		}, function(err, data) {
			if(err)
				return typeof callback !== 'function' ? null :callback(err, null);

			if(typeof callback === 'function')
				callback(err, data);
		})
	}

	removeProduct(id, callback) {
		let sql = 'delete from products where id = :id';

		MyDB.i().connection.query(sql, {id}, function(err, data){
			if(err)
				return typeof callback !== 'function' ? null :callback(err, data);

			if(typeof callback === 'function')
				callback(err, data);
		});
	}

	purchase (product_id, orders, callback) {
		callback = typeof callback === 'function' ? callback : function(){};

		this.getProduct(product_id, function(err, product) {
			if(err)
				return callback(err);

			if(product.stock_qty < orders)
				return callback("Item count is more than stock quantity");

			MyDB.i().end();

			let sql = `update products 
					  set orders = orders + ?
				    where id = ?`;

			MyDB.i().connection.query(sql, [orders, product.id], function(err, data) {
				if(err)
					return callback(err);

				callback();
			})
		});
	}
}

module.exports = Products;