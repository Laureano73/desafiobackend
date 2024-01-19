import MessageModel from "../models/messages.models.js"

export class Message {
  constructor(user, message) {
    this.user = user
    this.message = message
  }
}

export class MessageMongoManager {
  async getMessages() {
    try {
      const parseMessages = await MessageModel.find().lean()
      return {message: "OK" , rdo: parseMessages}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "No hay mensajes"}
    }
  }

  async addMessage(mensaje){
    try{
      const validacion = !mensaje.user || !mensaje.message ? false : true
      if (!validacion)
        return {message: "ERROR" , rdo: "Faltan datos en el mensaje"}

        const added = await MessageModel.create(mensaje)
        return {message: "OK" , rdo: "Mensaje dado de alta correctamente"}
    }
    catch (err) {
      res.status(400).json({ message: "Error al dar de alta el mensaje - " + err.menssage })
    }
  }

  async deleteMessage(id) {
    try {
      const deleted = await MessageModel.deleteOne({_id: id})

      if (deleted.deletedCount === 0){
        return {message: "ERROR" , rdo: `No se encontró el mensaje con el ID ${id}. No se pudo eliminar.`}
      }

      return {message: "OK" , rdo: `Mensaje con ID ${id} eliminado exitosamente.`}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al momento de eliminar el mensaje - "+ e.message}
    }
  }
}


