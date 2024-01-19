import { Router } from "express"
//import { ProductManager } from "../dao/managerFS/ProductManager.js"
import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import { uploader } from '../utils/multer.js'


const productRouter = Router()

// ** Métodos con Mongoose
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-                M O N G O O  D B             -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

productRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, query = '', sort = '' } = req.query;
    const products = new ProductMongoManager()

    const resultado = await products.getProducts(limit, page, query, sort);
    if (resultado) {
      res.send(resultado);
    }
    else {
      res.status(400).json({ message: 'Not found' })
    }
  }
  catch (err) {
    console.log({ err });
    res.status(400).json({ message: "Error al obtener los productos" + err.menssage })
  }
})

productRouter.get("/:pId", async (req, res) => {
  try {
    const { pId } = req.params
    const products = new ProductMongoManager()

    const resultado = await products.getProductById(pId)
    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch (err) {
    res.status(400).json({ message: "El producto no existe" })
  }
})

productRouter.post('/', uploader.single('file'), async (req, res) => { //tiene un midleware con el file
  try {
    const products = new ProductMongoManager()
    const newProduct = req.body
    //const path=req.file.path.split('public').join('') //obtuve el path quitando la palabra public
    //const added = await products.addProduct({...newProduct, thunbnail: path})  
    const resultado = await products.addProduct(newProduct)
    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch (err) {
    res.status(400).json({ message: err })
  }
})

productRouter.put('/:pId', async (req, res) => {
  try {
    const { pId } = req.params
    const updateProd = req.body
    const products = new ProductMongoManager()

    const resultado = await products.updateProduct(pId, updateProd)

    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch (err) {
    res.status(400).json({ menssage: 'err' })
  }
})

productRouter.delete('/:pId', async (req, res) => {
  try {
    const { pId } = req.params
    const products = new ProductMongoManager()

    const deleted = await products.deleteProduct(pId)

    if (deleted.message === "OK")
      return res.status(200).json(deleted.rdo)

    return res.status(404).json(deleted.rdo)
  }
  catch (err) {
    res.status(400).json({ menssage: err })
  }
})


export default productRouter