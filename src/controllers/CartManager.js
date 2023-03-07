import {existsSync, promises as fs} from 'fs'

class Cart {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
}


export class CartManager {
    constructor(path) {
        this.path = path
    }

    checkJson = () => {
        //Creamos archivo JSON de carrito.
        !existsSync(this.path) && fs.writeFile(this.path, "[]", 'utf-8');
    }

    addCart = async () => {
        this.checkJson()
        try {
            const read = await fs.readFile(this.path, 'utf-8')
            let carts = JSON.parse(read)
            let newId
            carts.length > 0 ? newId = carts[carts.length - 1].id + 1 : newId = 1;
            const nuevoCarrito = new Cart (newId, []);
            carts.push(nuevoCarrito);
            await fs.writeFile(this.path, JSON.stringify(carts))
            console.log(`Carrito con id: ${nuevoCarrito.id} creado`)
            return newId
        } catch {
            return "Hubo un error al crear el carrito."
        }
            
    }

    getCartById = async (idCart) => {
        this.checkJson()
        try {
            const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            let cartIndex = carts.findIndex(cart => cart.id === idCart);
            
            if (carts[cartIndex]) {
                return carts[cartIndex]
            } else {
                throw `Carrito con ID: ${cart.id} no encontrado.`
            }
        } catch {
            return "Carrito no encontrado"
        }           
    }

    addProductToCart = async (idCart, idProduct, prodQty) => {
        this.checkJson()
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        //Chequeamos que el carrito existe con ese id.
        if(carts.some(cart => cart.id === parseInt(idCart))) {
            //Obtenemos el índice del array de carritos
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
            //Obtenemos el índice del prdoucto dentro del carrito
            const objetoCarrito = new Cart(idCart, carts[cartIndex].products)
            const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))
            if(prodIndex === -1) {
                //Si no existe pusheamos el producto al array de productos dentro del carrito
                objetoCarrito.products.push({product: idProduct, quantity: prodQty})
                //Actualizamos el carrito en el array de carritos
                carts[cartIndex] = objetoCarrito;
            } else {
                //Si existe aumentamos la cantidad en 1
                carts[cartIndex].products[prodIndex].quantity += prodQty;
            } 
            //Escribimos el Json del carrito con el producto nuevo
            await fs.writeFile(this.path, JSON.stringify(carts), 'utf-8')
            return "Producto agregado al carrito"
        } else {
            return "Hubo un error al agregar el producto al carrito."
        }
    }

    deleteCart = async (id) => {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(carts.some(cart => cart.id === parseInt(id))) {
            const cartsFiltrados = carts.filter(cart => cart.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(cartsFiltrados))
            return "Carrito eliminado"
        } else {
            return "Carrito no encontrado"
        }
    }
    deleteProductFromCart = async (idCart, idProduct) => {
        this.checkJson()
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        //Chequeamos que el carrito existe con ese id.
        if(carts.some(cart => cart.id === parseInt(idCart))) {
            //Obtenemos el índice del array de carritos
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
            //Obtenemos el índice del prdoucto dentro del carrito
            const objetoCarrito = new Cart(idCart, carts[cartIndex].products)
            const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))
            if(prodIndex !== -1) {
                //Si existe eliminamos el producto del carrito
                const prodsFiltrados = objetoCarrito.products.filter(obj => obj.product !== parseInt(idProduct))
                //Actualizamos el carrito en el array de carritos
                objetoCarrito.products = prodsFiltrados;
                carts[cartIndex] = objetoCarrito;
            } else {
                return "El producto no existe en el carrito y no pudo ser eliminado."
            }
            //Escribimos el Json del carrito con el producto nuevo
            await fs.writeFile(this.path, JSON.stringify(carts), 'utf-8')
            return "Producto eliminado del carrito"
        } else {
            return "Hubo un error al eliminar el producto del carrito."
        }
    }
}
