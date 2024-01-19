import fs from "fs";

export class ProductCart {
  constructor(id, quantity) {
    this.id = id
    this.quantity = quantity
  }
}

export class CartManager {
  #carts
  
  constructor(path){
    this.path = path;
    this.#carts = [];
  }

  async addProductsInCart(cId, pId, quantity) {
    try {
      this.#carts = await this.getCarts();
      const index = this.#carts.findIndex((e) => e.id === +cId);
      
      if (index===-1)
        return `No existen el carrito con el id ${cId}`

      const productsCart = this.#carts[index].products //Obtengo el array de productos

      //busco el producto por el Id
      const prod = productsCart.find(product=>product.id === pId)

      //Busco el producto en el carrito, si no existe lo agrego, sino actualizo el quantity
      if (prod) { //si ya existe el producto en el carrito
        const indexProd = productsCart.findIndex(product=>product.id === pId)
        productsCart[indexProd].quantity +=1
      }
      else //si no existe el producto en el carrito
      {
        const newProduc = new ProductCart(pId,quantity)
        productsCart.push(newProduc)
      }

      this.#carts[index] = { ...this.#carts[index],products: productsCart};
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.#carts),
        "utf-8"
      );
      return `Producto agregado al carrito ${cId} correctamente`
    } catch (e) {
      return "Error al momento de agregar el producto al carrito. " + e.message;
    }
  }


  async addCart() {
    try {
      this.#carts = await this.getCarts();
      const id = this.#carts.length + 1;
      this.#carts.push({ products:[], id: id });
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.#carts),
        "utf-8"
      );
      return "Carrito dado de alta correctamente"
    } catch (e) {
      return "Error al momento de agregar el producto" + e.message;
    }
  }

  async getCarts() {
    try {
      const carritos = await fs.promises.readFile(this.path, "utf-8");
      const parseCarritos = JSON.parse(carritos);
      return parseCarritos;
    } catch (e) {
      return "No hay carritos"
    }
  }

  async getProductsCartById(id) {
    this.#carts = await this.getCarts();
    const prod = this.#carts.find((e) => e.id === id);

    if (prod) 
      return prod.products;
    else 
      return [];
  }

}