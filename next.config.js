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