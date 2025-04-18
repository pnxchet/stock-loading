const express = require('express');
const app = express();
const stockTaskRoutes = require('./routes/stockTaskRoutes');

app.use(express.json());

app.use('/api', stockTaskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
