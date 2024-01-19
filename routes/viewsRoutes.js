import express from "express"
//import { ProductManager } from "../dao/managerFS/ProductManager.js";
import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"

const viewRoutes = express.Router()
//const path="./src/json/productos.json"
//const productManager = new ProductManager(path);
const productManager=new ProductMongoManager()


viewRoutes.get("/", async (req, res) => {
  const resultado = await productManager.getProducts();

  if (resultado.message === "OK")
    res.render("home", { title: "Home", data: resultado.rdo });
});

viewRoutes.get("/realtimeproducts", async (req, res) => {
  const resultado = await productManager.getProducts();
  if (resultado.message==="OK")
    res.render("realtimeproducts", { title: "RealTime Products", data: resultado.rdo })
})

viewRoutes.get('/products', async (req, res) => {
  const {page} = req.query;
  const products = await productManager.getProducts(10, page);
  console.log({products});
  res.render('products', products);
});

viewRoutes.get('/chat', async (req, res)=>{
  res.render('chat')
})

export default viewRoutes
