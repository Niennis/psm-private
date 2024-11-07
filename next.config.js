const express = require('express');
const app = express();

app.use((req, res, next) => {
  if (req.url === '/') {
    return res.redirect(302, '/login');
  }
  next();
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/login', // Ruta real (puede ser diferente)
      },
    ];
  },
};