Integrantes:
Nazarena Contreras
Mary Lezama
Rocio Ibañez 


# 🌱 API VIVERO

API REST para la gestión de un vivero, desarrollada con **Node.js + Express**.  
Incluye autenticación con **JWT**, validaciones con **express-validator** y almacenamiento en archivos JSON.

---

## 🚀 Instalación local

```bash
git clone https://github.com/tuusuario/api-vivero.git
cd TPI-MODULO-3
npm install
npm run dev

El servidor correrá en:
👉 http://localhost:3000

⚙️ Variables de entorno (.env)
PORT=10000
SECRET_KEY=clavesecreta

📦 Endpoints principales

🔐 Autenticación

POST /api/auth/register → Crear usuario

POST /api/auth/login → Iniciar sesión

GET /api/auth/verify → Verificar token

🌿 Plantas

GET /api/plants → Listar plantas

POST /api/plants → Crear planta

PUT /api/plants/:id → Actualizar planta

DELETE /api/plants/:id → Eliminar planta

👥 Clientes

GET /api/clients

POST /api/clients

PUT /api/clients/:id

DELETE /api/clients/:id

🛒 Ventas

GET /api/sales

POST /api/sales

PUT /api/sales/:id/status

DELETE /api/sales/:id

☁️ Deploy en Render

Subí el proyecto a un repositorio GitHub.

En Render.com
:

Crear New Web Service

Conectar tu repo

Build Command: npm install

Start Command: npm start

Definí variables de entorno (PORT, JWT_SECRET).

¡Listo! 🚀

Desarrollado con ❤️ por el equipo del Vivero.
