const inquirer = require("inquirer");
const Products = require('./my_modules/products');
const Departments = require('./my_modules/departments');
const Table = require("cli-table");
const MyDB = require("./my_modules/my-db")

const products = new Products();
const departments = new Departments();

askToDo();


function askToDo () {
	inquirer.prompt([
		{
			type: 'list',
			name: 'to_do',
			message: 'What would you like to do?',
			choices: [
				{value: 1, name: 'View Product for Sale'},
				{value: 2, name: 'View Low Inventory'},
				{value: 3, name: 'Add to Inventory'},
				{value: 4, name: 'Add New Product'},
				{value: 5, name: 'Quit'}
			]
		}
	]).then(function(answer){
		switch(answer.to_do) {
			case 4:
				departments.getDepartments(function(err, departmentsList){
					let deps = [];
					for(let i in departmentsList)
						deps.push({
							name: departmentsList[i].name,
							value: departmentsList[i].id
						});

					inquirer.prompt([
						{
							type: 'input',
							name: 'name',
							message: 'What is the name of the product you would like to add?',
							validate: (input) => !!input.match(/^.+$/gi)
						},
						{
							type: 'list',
							name: 'department_id',
							message: 'Which department does this product fall into?',
							choices: deps
						},
						{
							type: 'input',
							name: 'price',
							message: 'How much does it cost?',
							validate: (input) => !!input.match(/^[0-9]+(\.[0-9]+)?$/gi)
						},
						{
							type: 'input',
							name: 'qty',
							message: 'How many do we have?',
							validate: (input) => !!input.match(/^[0-9]+$/gi)
						}
					]).then(function(answer){
						products.createNewProduct({
							name: answer.name,
							stock_qty: answer.qty,
							price: answer.price,
							department_id: answer.department_id
						}, function(err, data){
							if(err)
								throw err;

							if(data.affectedRows)
								console.log(answer.name, "ADDED TO BAMAZON!!!\n\n");

							askToDo();
						})
					})
				});
				break;
			case 5:
				console.log("Goodbye!")
				break;
			default:
				console.log("Demo was unclear that's why I don't know what to do with this choise :)")
		}

		MyDB.i().end();
	});
}

function showProducts (productsList) {
	console.log(productsList);
}

MyDB.i().end();