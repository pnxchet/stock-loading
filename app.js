const express = require('express');
const app = express();
const stockTaskRoutes = require('./routes/stockTaskRoutes');

app.use(express.json());
app.use('/api/tasks', stockTaskRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
