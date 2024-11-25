module.exports = {
  cacheHandler: require.resolve('./src/utils/cache-handler.js'),
  distDir: '.next', // Mantener el estándar.
  compress: true, // Habilita compresión por defecto.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
      },
    ],
  },
};