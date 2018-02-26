class Product {
	constructor (product) {
		for(let i in product)
			this[i] = product[i];
	}
}

module.exports = Product;