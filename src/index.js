import express from "express";
import routerProduct from "./routes/productos.routes.js";
import routerCart from "./routes/carritos.routes.js";
import { __dirname } from "./path.js";
import multer from 'multer';
import { engine } from "express-handlebars";
import * as path from 'path';
import { Server } from "socket.io";
import routerSocket from "./routes/socket.routes.js";
import { ProductManager } from "./controllers/ProductManager.js";

const productManager = new ProductManager('src/models/productos.json');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req,file,cb) => {
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({storage:storage});

//Express Server
const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    //console.log(`Server on http://localhost:${PORT}`)
})

//ServerIO
const io = new Server(server)

io.on("connection", async (socket) => { //io.on es cuando se establece la conexion
    console.log("Cliente conectado")

    socket.on("addProduct", async info => {//Cuando recibo informacion de mi cliente
        socket.emit("msgAddProduct", await productManager.addProduct(info, ["../public/img/Sirenita.jpg"]))
        socket.emit("getProducts", await productManager.getProducts())
    })
    

    socket.on("deleteProduct", async id => {
        socket.emit("msgDeleteProduct", await productManager.deleteProduct(parseInt(id)))
        socket.emit("getProducts", await productManager.getProducts())
    })

    socket.emit("getProducts", await productManager.getProducts());
})


//Middlewares
app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));//__dirname + './views'


//Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/', routerSocket)
app.use('/realtimeproducts', routerSocket)
app.use('/api/products', routerProduct)
app.use('/api/carts', routerCart)
//app.post('/upload',upload.single('product'), (req,res) => {
   // console.log(req.file)
   // res.send("Imagen subida")
//})


