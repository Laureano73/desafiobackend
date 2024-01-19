import fs from "fs";

export class Producto {
  constructor(title, description, price, code, stock, status, category, thunbnail) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.status = status;
    this.category = category;
    this.thunbnail = thunbnail;
  }
}

export class ProductManager {
  #products;

  constructor(path) {
    this.path = path;
    this.#products = [];
  }

  async addProduct(producto) {
    try {
      //Validacion de los campos
      const validacion = !producto.title || !producto.description || !producto.price || !producto.code || !producto.stock || !producto.status || !producto.category ? false : true;

      if (!validacion)
        return "Faltan datos en el producto a ingresar"

      this.#products = await this.getProducts();
      const prod = this.#products.find((e) => e.code === producto.code);

      if (prod) return "Producto con código Existente existente!"

      const id = this.#products.length + 1;
      this.#products.push({ ...producto, id: id });
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.#products),
        "utf-8"
      );
      return "Producto dado de alta correctamente"
    } catch (e) {
      return "Error al momento de agregar el producto. " + e.message;
    }
  }

  async getProducts() {
    try {
      const productos = await fs.promises.readFile(this.path, "utf-8");
      const parseProductos = JSON.parse(productos);
      return parseProductos;
    } catch (e) {
      return "No hay productos"
   }
}

  async getProductById(id) {
    this.#products = await this.getProducts();
    const prod = this.#products.find((e) => e.id === id);

    if (prod) 
      return prod;
    else 
      return {};
  }

  async updateProduct(id, newProduct) {
    this.#products = await this.getProducts();
    const index = this.#products.findIndex((e) => e.id === id);

    // Verifica si se encontró un producto con el id
    if (index !== -1) {
      // Elimino el id de newProduct para no tenerlo en cuenta al actualizar
      //Desestructuro para que el id de newProduct se llame newProductId y el  resto de los campos se almacena en newProductWithoutId, que luego lo utilizo para la actualizacion 
      const { id: newProductId, ...newProductWithoutId } = newProduct;

      // Reemplaza el producto en el array productos
      this.#products[index] = { ...this.#products[index],...newProductWithoutId, id: id };
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.#products),
        "utf-8"
      );
      return `Producto con ID ${id} actualizado exitosamente.`
    } else
      return `No se encontró un producto con el ID ${id}. No se realizó ninguna actualización.`;
  }

  async deleteProduct(id) {
    this.#products = await this.getProducts();
    const index = this.#products.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.#products.splice(index, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.#products),
        "utf-8"
      );
      return `Producto con ID ${id} eliminado exitosamente.`
    } else
      return `No se encontró un producto con el ID ${id}. No se pudo eliminar.`
  }
}
