class Plant {
  constructor({ id, name, species, price, stock, createdAt, updatedAt }) {
    // Validar campos obligatorios
    if (!id || !name || !species || !price === undefined || stock === undefined) {
      throw new Error('Faltan campos obligatorios en Planta');
    }

    // Validar que precio sea numerico positivo
    if (typeof price !== 'number' || price <= 0) {
      throw new Error('El precio debe ser un numero positivo');
    }

    // Validar que stock sea entero no negativo
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('El stock debe ser un numero entero no negativo');
    }

    this.id = id;
    this.name = name;
    this.species = species;
    this.price = price;
    this.stock = stock;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  // Metodo para obtener informacion de la planta
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      species: this.species,
      price: this.price,
      stock: this.stock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Metodo para representacion en string (util para logs)
  toString() {
    return `Plant(${this.id}): ${this.name} (${this.species}) - $${this.price} | Stock: ${this.stock}`;
  }

  // Metodo para actualizar timestamps
  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }

  // Metodo para reducir stock
  reduceStock(quanity) {
    if (!Number.isInteger(quanity) || quanity <= 0) {
      throw new Error('La cantidad debe ser un numero entero positivo');
    }
    if (this.stock < quanity) {
      throw new Error(`Stock insuficiente. Disponible: ${this.stock}, Solicitado: ${quanity}`);
    }
    this.stock -= quanity;
    this.updateTimestamp();
  }

  // Metodo para aumentar stock
  increaseStock(quanity) {
    if (!Number.isInteger(quanity) || quanity <= 0) {
      throw new Error('La cantidad debe ser un numero entero positivo')
    }
    this.stock += quanity;
    this.updateTimestamp();
  }

  // Metodo para verificar si hay stock disponible
  hasStock(quanity = 1) {
    return this.stock >= quanity;
  }
}

module.exports = Plant;