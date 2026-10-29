require('dotenv').config();
const app = require('./api/index');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 Shree RCH Cloud Server running on http://localhost:${PORT}
  🔑 Admin Dashboard: http://localhost:${PORT}/admin
  📡 Extension API: http://localhost:${PORT}/api/client
  `);
});
