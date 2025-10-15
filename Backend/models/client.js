class Client {
  constructor({ id, name, email, phone, createdAt, updatedAt }) {
    // validar campos obligatorios
    if (!id || !name || !email || !phone) {
      throw new Error('Faltan campos obligatorios en Cliente');
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  // Metodo para obtener informacion del cliente
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Metodo para representacion de string (util para logs)
  toString() {
    return `Client(${this.id}): ${this.name} - ${this.email}`;
  }

  // Metodo para actualizar timestamps
  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Client;