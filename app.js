import express from "express";
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import messagesRouter from "./routes/messagesRoutes.js";
import { ProductMongoManager } from "./dao/managerDB/ProductMongoManager.js";
import { MessageMongoManager } from "./dao/managerDB/MessageMongoManager.js";
import viewRoutes from './routes/viewsRoutes.js';

const PORT = 8080;
const app = express();
const productManager = new ProductMongoManager();
const messageManager = new MessageMongoManager();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect("mongodb+srv://sergiocupe:Coder2024@coder.0nonzsv.mongodb.net/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// Handlebars Configuration
const hbs = handlebars.create({
  extname: '.handlebars',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});


app.engine('handlebars', hbs.engine);
app.set('views', 'src/views');
app.set('view engine', 'handlebars');
app.use('/', viewRoutes);

// Routes API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/messages', messagesRouter);

// Server
const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Sockets
const socketServer = new Server(httpServer);
const messages = [];

socketServer.on("connection", (socket) => {
  console.log("New client connected");

  socket.on('addProd', async prod => {
    try {
      const rdo = await productManager.addProduct(prod);
      if (rdo.message === "OK") {
        const resultado = await productManager.getProducts();
        if (resultado.message === "OK") {
          socket.emit("getAllProducts", resultado.rdo);
        }
      }
      return rdo;
    } catch (error) {
      console.error("Error al dar de alta un producto: ", error.message);
      socket.emit("error", { message: "Error al dar de alta un producto" });
    }
  });

  socket.on('delProd', async id => {
    try {
      const deleted = await productManager.deleteProduct(id);
      if (deleted.message === "OK") {
        const resultado = await productManager.getProducts();
        if (resultado.message === "OK") {
          socket.emit("getAllProducts", resultado.rdo);
        }
      } else {
        console.error("Error al eliminar un producto: ", deleted.rdo);
        socket.emit("error", { message: "Error al eliminar un producto" });
      }
    } catch (error) {
      console.error("Error al eliminar un producto: ", error.message);
      socket.emit("error", { message: "Error al eliminar un producto" });
    }
  });

  socket.on('message', data => {
    messages.push(data);
    messageManager.addMessage(data);
    socketServer.emit('messageLogs', messages);
  });

  socket.on('newUser', data => {
    socket.emit('newConnection', 'Un nuevo usuario se conectó - ' + data);
    socket.broadcast.emit('notification', data);
  });
});
