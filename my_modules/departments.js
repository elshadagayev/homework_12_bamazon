const MyDB = require("./my-db");
const Department = require("./department");

class Departments {
	constructor () {

	}

	getDepartments (callback) {
		let sql = `
			select d.id,
				   d.name
			  from departments d
		`;

		const departments = [];

		MyDB.i().connection.query(sql, function(err, data) {
			if(err)
				return typeof callback !== 'function' ? null :callback(err, []);

			for (let i in data)
				departments.push(new Department(data[i]));

			if(typeof callback === 'function')
				callback(err, departments);
		});
	}

	getDepartmentsDetailedList (callback) {
		let sql = `
			select d.id,
				   d.name,
				   sum(p.price * p.orders) profit,
				   sum(p.stock_qty - p.orders) stock_qty,
				   p.orders,
				   d.cost
			  from departments d
			  left join products p on p.department_id = d.id
			  group by d.id
		`;

		const departments = [];

		MyDB.i().connection.query(sql, function(err, data) {
			if(err)
				return typeof callback !== 'function' ? null :callback(err, []);

			for (let i in data)
				departments.push(new Department(data[i]));

			if(typeof callback === 'function')
				callback(err, departments);
		});
	}

	getDepartment (id, callback) {
		let sql = `
			select d.id,
				   d.name,
				   sum(p.price * p.orders) profit,
				   sum(p.stock_qty) stock_qty,
				   p.orders,
				   d.cost
			  from departments d
			  left join products p on p.department_id = d.id
			  where d.id = :id
		`;

		MyDB.i().connection.query(sql, {id}, function(err, data) {
			if(err)
				return typeof callback !== 'function' ? null :callback(err, new Product());

			if(typeof callback === 'function')
				callback(err, new Product(data));
		});
	}

	createNewDepartment (data, callback) {
		let sql = "insert into departments set ?"

		MyDB.i().connection.query(sql, {
			name: data.name,
			cost: data.cost
		}, function(err,data){
			if(err)
				return typeof callback !== 'function' ? null :callback(err, null);

			if(typeof callback === 'function')
				callback(err, data);
		});
	}

	updateDepartment(data, callback) {
		let sql = `update products 
					  set name = :name, 
					      cost = :cost
				    where id = :id`;

		MyDB.i().connection.query(sql, {
			name: data.name,
			cost: data.cost,
			id: data.id
		}, function(err, data) {
			if(err)
				return typeof callback !== 'function' ? null :callback(err, null);

			if(typeof callback === 'function')
				callback(err, data);
		})
	}

	removeDepartment(id, callback) {
		let sql = 'delete from departments where id = :id';

		MyDB.i().connection.query(sql, {id}, function(err, data){
			if(err)
				return typeof callback !== 'function' ? null :callback(err, data);

			if(typeof callback === 'function')
				callback(err, data);
		});
	}
}

module.exports = Departments;