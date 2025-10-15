class Sale {
  constructor({ id, date, clientId, items, total, status,createdAt,updatedAt }) {
    // Validar campos obligatorios
    if (!id || !date || !clientId || !Array.isArray(items) || items.length === 0 || total === undefined || !status) {
      throw new Error('Faltan campos obligatorios en Venta');
    }

    // Validar que total sea numero positivo
    if (typeof total !== 'number' || total <= 0) {
      throw new Error('El total debe ser un número positivo');
    }

    // Validar estados validos
    const validStatuses = ['pendiente', 'pagado', 'entregado', 'cancelado'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado inválido. Estados permitidos: ${validStatuses.join(', ')}`);
    }

    // Validar items
    if (!this.validateItems(items)) {
      throw new Error('Items invalidos. Cada item debe tener plantId y quantity');
    }

    this.id = id;
    this.date = date;
    this.clientId = clientId;
    this.items = items;
    this.total = total;
    this.status = status;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  // Validar que items sean correctos
  validateItems(items) {
    return items.every(item => item.plantId && item.quantity && item.quantity > 0);
  }

  // Metodo para obtener informacion de la venta
  getInfo() {
    return {
      id: this.id,
      date: this.date,
      clientId: this.clientId,
      items: this.items,
      total: this.total,
      status: this.status,
      itemCount: this.items.length,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Método para representacion en string (util para logs)
  toString() {
    return `Sale(${this.id}): Cliente ${this.clientId} - $${this.total} - ${this.status.toUpperCase()} (${this.items.length} items)`;
  }

  // Metodo para actualizar timestamps
  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }

  // Metodo para cambiar estado
  updateStatus(newStatus) {
    const validStatuses = ['pendiente', 'pagado', 'entregado', 'cancelado'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Estado invalido. Estados permitidos: ${validStatuses.join(', ')}`);
    }

    this.status = newStatus;
    this.updateTimestamp();
  }

  // Metodo para verificar si la venta esta pagada
  isPaid() {
    return this.status === 'pagado' || this.status === 'entregado';
  }

  // Metodo para verificar si la venta esta entregada
  isDelivered() {
    return this.status === 'entregado';
  }

  // Metodo para verificar si la venta esta cancelada
  isCancelled() {
    return this.status === 'cancelado';
  }

  // Metodo para obtener cantidad total de items
  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Metodo para obtener resumen de la venta
  getSummary() {
    return {
      id: this.id,
      clientId: this.clientId,
      date: this.date,
      totalItems: this.getTotalItems(),
      totalAmount: this.total,
      status: this.status,
    };
  }
}

module.exports = Sale;