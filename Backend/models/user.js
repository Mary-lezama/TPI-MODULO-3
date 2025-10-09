class User {
  constructor(id, username, password, role = 'employee') {
    this.id = id; // número o string único
    this.username = username;
    this.password = password;
    this.role = role; // 'admin' o 'employee'
    this.createdAt = new Date();
  }
}


module.exports = User;