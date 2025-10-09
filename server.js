require('dotenv').config();
const express = require('express');
const cors = require('cors');

const plantRoutes = require('./Backend/routes/plantRoutes');
const clientRoutes = require('./Backend/routes/clientRoutes');
const saleRoutes = require('./Backend/routes/saleRoutes');
const errorHandler = require('./Backend/middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/plants', plantRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', saleRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});