class Department {
	constructor (department) {
		for(var i in department)
			this[i] = department[i];
	}
}

module.exports = Department;