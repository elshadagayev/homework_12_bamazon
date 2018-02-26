const mysql = require("mysql");
require("dotenv").config();
const {MYSQL_HOST, MYSQL_DB, MYSQL_USER, MYSQL_PASS, MYSQL_PORT} = process.env;

let instance = null;

class MyDB {

	constructor () {
		this.connection = this.getConnection();
		this.createTables();
	}

	static i () {
		if(instance === null) {
			instance = new MyDB();
		}

		return instance;
	}

	createTables () {
		let sql = `create table if not exists departments (
			id int(11) unsigned not null auto_increment,
		    name varchar(120) not null,
		    cost float unsigned default 0,
		    primary key(id)
		)`

		this.connection.query(sql, function(err){
			if(err)
				console.log("Error 31", err);
		});

		sql = `create table if not exists products (
			id int(11) unsigned not null auto_increment,
		    name varchar(120) not null,
		    department_id int(11) unsigned not null,
		    price float unsigned not null default 0,
		    stock_qty int(11) unsigned not null default 0,
		    orders int(11) unsigned not null default 0,
		    primary key(id),
		    key(department_id)
		)`

		this.connection.query(sql, function(err){
			if(err)
				console.log("Error 31", err);
		});

		this.connection.query("set sql_mode=''");
	}

	getConnection () {
		const con = mysql.createConnection({
			host: MYSQL_HOST,
			user: MYSQL_USER,
			password: MYSQL_PASS,
			database: MYSQL_DB
		});

		con.connect();
		return con;
	}

	end () {
		this.connection.end();
		instance = null;
	}
}

module.exports = MyDB;