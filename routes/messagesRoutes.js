import { Router } from "express"
//import { CartManager } from "../dao/managerFS/CartManager.js"
import { MessageMongoManager } from "../dao/managerDB/MessageMongoManager.js"

const messageRouter = Router()

// ** Métodos con Mongoose
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-                M O N G O O  D B             -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

messageRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query
    const message = new MessageMongoManager()

    const resultado = await message.getMessages()

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
    res.status(400).json({ message: "Error al obtener los mensajes - " + err.menssage })
  }
})

messageRouter.post('/', async (req,res)=>{  
  try{
    const message = new MessageMongoManager()
    const newMsg = req.body
    const resultado = await message.addMessage(newMsg)  
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err){
    res.status(400).json({message: err})
  }
})

messageRouter.delete('/:mId',async (req,res)=>{
  try{
    const {mId} = req.params
    const message = new MessageMongoManager()

    const deleted = await message.deleteMessage(mId)

    if (deleted.message==="OK")
      return res.status(200).json(deleted.rdo)

    return res.status(404).json(deleted.rdo)
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
})

export default messageRouter