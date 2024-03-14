import fs from "fs";

export class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.readCartsFromFile();
  }


  async readCartsFromFile() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      this.carts = JSON.parse(data);
      this.nextId =
        this.carts.length > 0
          ? Math.max(...this.carts.map((p) => p.id)) + 1
          : 1;
    } catch (error) {
      console.error(`Error en la lectura del archivo: ${error.message}`);
      this.carts = [];
    }
  }


  async writeCartsToFile() {
    fs.promises.writeFile(
      this.filePath,
      JSON.stringify(this.carts, null, 2),
      "utf-8"
    );
  }

  
  async findCartIndex(id) {
    return this.carts.findIndex((carts) => carts.id == id);
  }


  async getCartById(id) {
    await this.readCartsFromFile();
    const cart = this.carts.find((cart) => cart.id == id);
    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }
    return cart;
  }


  async addCart() {
    await this.readCartsFromFile();
    const newCart = {
      id: this.nextId++,
      products: [],
    };
    this.carts.push(newCart);
    await this.writeCartsToFile();
    return newCart;
  }


  async addProductToACart(cartId, productDetails, quantity = 1) {
    
    await this.readCartsFromFile();

    const cartIndex = this.findCartIndex(cartId);

    if (cartIndex == -1) {
      throw new Error("Carrito no encontrado.");
    }

    const cart = this.carts.find((cart) => cart.id == cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId == productDetails.id
      );
    
    if (cartIndex == -1) {
      throw new Error("Carrito no encontrado.");
    }
        
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId: productDetails.id, quantity });
    }

    await this.writeCartsToFile();
    return cart;
  }
}