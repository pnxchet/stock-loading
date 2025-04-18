const express = require('express');
const app = express();
const stockTaskRoutes = require('./routes/stockTaskRoutes');

app.use(express.json()); // ใช้เพื่อรับ request body เป็น JSON

// ใช้ routes สำหรับ stock tasks
app.use('/api', stockTaskRoutes);

// เริ่ม server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
