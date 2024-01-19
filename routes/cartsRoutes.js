import { Router } from "express"
//import { CartManager } from "../dao/managerFS/CartManager.js"
import { CartMongoManager } from "../dao/managerDB/CartMongoManager.js"

const cartRouter = Router()

// ** Métodos con Mongoose
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-                M O N G O O  D B             -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

cartRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query
    const carts = new CartMongoManager()

    const resultado = await carts.getCarts()

    if (resultado.message==="OK")
    {
      //Si no tiene limite, devuelve todos los productos
      if (!limit) 
        return res.status(200).json(resultado)

      const productsLimit = resultado.rdo.slice(0, limit)
      return res.status(200).json(productsLimit)
    }
    res.status(400).json(resultado)
  } 
  catch (err) {
    res.status(400).json({ message: "Error al obtener los carritos" + err.menssage })
  }
})

cartRouter.get("/:cId", async (req, res) => {
  try{
    const {cId}=req.params
    const products = new CartMongoManager()

    const resultado = await products.getProductsCartById(cId)
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err)
  {
    res.status(400).json({message: "El carrito no existe"})
  }
})

cartRouter.post('/', async (req,res)=>{ 
  
  try{
    const carts = new CartMongoManager()
    const resultado = await carts.addCart({products:[]})  
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err){
    res.status(400).json({message: err})
  }
})

cartRouter.post("/:cId/product/:pId",async (req,res)=>{

  console.log('Hola mundo');
  try{
    const {cId, pId} = req.params
    const newQuantity =  req.body.quantity
    const carts = new CartMongoManager()
    console.log({cId, pId, newQuantity});
    const result = await carts.addProductsInCart(cId, pId, newQuantity)

    if (result){
      return res.status(200).json({message: 'Product added'});
    }
    res.status(400).json({message: 'could not add product'});
  }
  catch(err){
    res.status(400).send({err});
  }
})

cartRouter.delete('/:cId',async (req,res)=>{
  try{
    const {cId} = req.params
    const carts = new CartMongoManager()

    const deleted = await carts.deleteAllProductsInCart(cId);

    if (deleted)
      return res.status(200).json({message: 'Products deleted'});

    return res.status(404).json({menssage: 'could not delete products'});
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
})

cartRouter.delete('/:cId/products/:pId', async (req, res) => {
  const { cId, pId } = req.params;
  const cartManager = new CartMongoManager();
  try {
    const result = await cartManager.deleteProductInCart(cId, pId);
    if(result){
      res.send({message: 'Product deleted'});
    }
    else{
      res.status(400).json({message: 'could not delete product'});
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({message: 'could not delete product'});
  }
});


cartRouter.put('/:cId', async (req, res) => {
  const cartManager = new CartMongoManager();
  const { cId } = req.params;
  const cart = req.body;
  try {
    const result = await cartManager.updateCart(cId, cart);
    if(result.modifiedCount > 0){
      res.send({message: 'Cart updated'});
    }
    else{
      res.status(400).send({message: 'Could not update cart'});
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({message: 'Could not update cart'});
  }
});

cartRouter.put('/:cId/products/:pId', async (req, res) => {
  const { cId, pId } = req.params;
  const { quantity } = req.body;
  const cartManager = new CartMongoManager();
  const result = await cartManager.updateProductInCart(cId, pId, quantity);
  if(result){
    res.send({message: 'Product updated'});
  }
  else{
    res.status(400).send({message: 'could not update product'});
  }
});

export default cartRouter