const Product = require('./product.class')

class Store {
    constructor (id) {
	    this.id = id
    	this.products = []
    }

    findProduct(id) {
        return this.products.find((prod) => prod.id === id)
    }

    addProduct(datosProd) {
        // Comprobamos que los datos sean correctos
        if (!datosProd.name) {
            throw `Debes indicar el nombre del producto`
        }
        if (!datosProd.price) {
            throw `Debes indicar el precio del producto`
        }
        if (isNaN(datosProd.price) || datosProd.price < 0) {
            throw `El precio debe ser un número positivo (${datosProd.price})`
        }
        if (datosProd.units && (!Number.isInteger(datosProd.units) || datosProd.units < 0 )) {
            throw `Las unidades deben ser un nº entero positivo (${datosProd.units})`
        }

        datosProd.id = this.lastId() + 1
        datosProd.price = Number(datosProd.price)
        if (datosProd.units) datosProd.units = Number(datosProd.units)
        const newProd = new Product(
            datosProd.id, 
            datosProd.name, 
            datosProd.price, 
            datosProd.units
        )
        this.products.push(newProd)
        return newProd
    }

    delProduct(id) {
        const prod = this.findProduct(Number(id))
        if (!prod) {
            throw `No existe el producto con id ${id}`
        }
        this.products = this.products.filter((item) => item.id !== Number(id))
        return prod
    }

    changeProductUnits(datosProd) {
        // Comprobamos que los datos sean correctos
        if (!datosProd.id) {
            throw `Debes indicar la id del producto`
        }
        if (!datosProd.units) {
            throw `Debes indicar las unidades del producto`
        }
        if (!Number.isInteger(Number(datosProd.units))) {
            throw `Las unidades deben ser un nº entero (${datosProd.units})`
        }

        const prod = this.findProduct(Number(datosProd.id))
        if (!prod) {
            throw `No existe el producto con id "${datosProd.id}"`
        }

        try {
            var prodChanged = prod.changeUnits(Number(datosProd.units))
        } catch(err) {
            throw err
        }

        return prodChanged
    }

    changeProduct(datosProd) {
        // Comprobamos que los datos sean correctos
        if (!datosProd.id) {
            throw `Debes indicar la id del producto`
        }   
        if (datosProd.price && (isNaN(datosProd.price) || datosProd.price < 0)) {
            throw `El precio debe ser un número positivo (${datosProd.price})`
        }
        if (datosProd.units && (!Number.isInteger(Number(datosProd.units)) || Number(datosProd.units) < 0 )) {
            throw `Las unidades deben ser un nº entero positivo (${datosProd.units})`
        }

        const prod = this.findProduct(Number(datosProd.id))
        if (!prod) {
            throw `No existe el producto con id "${datosProd.id}"`
        }

        if (datosProd.name) prod.name = datosProd.name
        if (datosProd.price != undefined && datosProd.price != "") prod.price = Number(datosProd.price)
        if (datosProd.units != undefined && datosProd.units != "") prod.units = Number(datosProd.units)

        return prod
    }

    totalImport() {
        return this.products.reduce((total, prod) => total + prod.productImport(), 0)
    }

    underStock(stock) {
        return this.products.filter((prod) => prod.units < stock)
    }

    orderByUnits() {
        return this.products.sort((prodA, prodB) => prodB.units - prodA.units)
    }

    orderByName() {
        return this.products.sort((prodA, prodB) => prodA.name.localeCompare(prodB.name))
    }

    toString() {
        let cadena = `Almacén ${this.id} => ${this.products.length} productos: ${this.totalImport().toFixed(2)} €`
        this.products.forEach((prod) => cadena += '\n- ' + prod)
        return cadena
    }

    lastId() {
        return this.products.reduce((max, prod) => prod.id > max ? prod.id : max, 0)
    }
}

module.exports = Store
