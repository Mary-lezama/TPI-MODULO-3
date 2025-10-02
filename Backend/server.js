
const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/product', require('../routes/product.js'))

const PORT = 3000 || process.env.PORT
app.listen(PORT, () => {
    console.log(`Server runing in http://localhost:${PORT}`)
})