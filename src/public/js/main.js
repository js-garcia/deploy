//Front
const socket = io()

const addForm = document.getElementById("addProductForm")
const deleteForm = document.getElementById("deleteProductForm")

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const price = document.getElementById("price").value
    const code = document.getElementById("code").value
    const stock = document.getElementById("stock").value
    const category = document.getElementById("category").value
    const thumbnail = []
    const product = {title,description,price,code,stock,category,thumbnail}
    socket.emit("addProduct", product) //Enviar informacion a mi servidor
})

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const id = document.getElementById("prodId").value
    socket.emit("deleteProduct", id)
})


socket.on("msgAddProduct", mensaje => {
    Swal.fire({
        icon: 'success',
        title: `Producto agregado con el id: ${mensaje.id}`,
        showConfirmButton: true,
        timer: 2000
    })
    console.log(mensaje)
})


socket.on("msgDeleteProduct", mensaje => {
    if (mensaje) {
        Swal.fire({
            icon: 'success',
            title: 'El Producto fue eliminado',
            showConfirmButton: true,
            timer: 2000
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'No se pudo eliminar el producto seleccionado',
            showConfirmButton: true,
            timer: 2000
        })
    }
    console.log(mensaje)
})


socket.on("getProducts", products => {
    const prodsFromServer = document.getElementById("productsFromServer")
    prodsFromServer.innerHTML=""
    
    products.forEach(product => {
        prodsFromServer.innerHTML += 
        `
        <div class="card col-sm-2 cardProduct">
        <img class="card-img-top imgCardProducts" src="${product.thumbnail}">
        <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
            <p class="card-text">ID: ${product.id} </p>
            <p class="card-text">${product.description} </p>
            <p class="card-text">Precio: ${product.price} </p>       
            <p class="card-text">Stock: ${product.stock} </p>   
            <p class="card-text">Code: ${product.code} </p>
        </div>
        `
    })
})