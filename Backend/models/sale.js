class Sale {
  constructor({ id, date, clientId, items, total, status }) {
    this.id = id;
    this.date = date;
    this.clientId = clientId;
    this.items = items;
    this.total = total;
    this.status = status;
  }
}

module.exports = Sale;