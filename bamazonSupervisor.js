const inquirer = require("inquirer");
const Products = require('./my_modules/products');
const Departments = require('./my_modules/departments');
const Table = require("cli-table");
const MyDB = require("./my_modules/my-db")

const products = new Products();
const departments = new Departments();

products.getProducts(function(err, productsList) {
	showProductsTable(productsList);
});


function showProductsTable (productsList) {
	const table = new Table({
		head: ['ID', 'Product name', 'Department name', 'Price', 'Stock Quantity'],
	});

	for(let i in productsList) {
		let product = productsList[i];
		
		table.push([
			product.id, 
			product.name, 
			product.department_name || 'n/a', 
			product.price, 
			product.stock_qty
		]);
	}

	console.log(table.toString());

	askToDo();
}

function askToDo () {
	inquirer.prompt([
		{
			type: 'list',
			name: 'to_do',
			message: 'What would you like to do?',
			choices: [
				{value: 1, name: 'View Product Sales by Department'},
				{value: 2, name: 'Create New Department'},
				{value: 3, name: 'Quit'}
			]
		}
	]).then(function(answer){
		switch(answer.to_do) {
			case 1:
				departments.getDepartmentsDetailedList(function(err, productsList){
					if(err)
						throw err;
					showProductSalesByDepartment(productsList);
					askToDo();
				});
				break;
			case 2:
				createNewDepartment();
				break;
			case 3:
				console.log("Goodbye!")
				break;
		}

		MyDB.i().end();
	});
}

function createNewDepartment () {
	inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'What is the name of the department?',
			validate: (input) => !!input.match(/^.+$/gi)
		},
		{
			type: 'input',
			name: 'cost',
			message: 'What is the overhead cost of the department?',
			validate: (input) => !!input.match(/^[0-9]+(\.[0-9]+)?$/gi)
		}
	]).then(function(answer){
		departments.createNewDepartment({
			name: answer.name,
			cost: answer.cost
		}, function(err, data){
			if(err)
				throw err;

			askToDo();
		});

		MyDB.i().end();
	});
}

function showProductSalesByDepartment (productsList) {
	const table = new Table({
		head: ['ID', 'Department name', 'Over Head Costs', 'Product Sales', 'Total Profit', 'Stock Quantity'],
	});

	for(let i in productsList) {
		let department = productsList[i];
		
		table.push([
			department.id, 
			department.name, 
			department.cost, 
			department.orders === null ? 'n/a' : department.orders, 
			department.profit === null ? 'n/a' : department.profit,
			department.stock_qty === null ? 'n/a' : department.stock_qty
		]);
	}

	console.log(table.toString());
}

MyDB.i().end();