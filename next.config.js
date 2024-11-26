module.exports = {
  cacheHandler: require.resolve('./src/utils/cache-handler.js'),
  output: 'standalone',
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
  async headers() {
    return [
      // {
      //   source: '/:path((?!api/auth|_next/static).*)',
      //   headers: [
      //     { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
      //   ],
      // },
      // {
      //   // Agregar encabezados a los archivos estáticos
      //   source: '/_next/static/:path*',
      //   headers: [
      //     { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      //     { key: 'Content-Encoding', value: 'gzip' },
      //   ],
      // },
      {
        // Cache para las páginas generadas
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, must-revalidate' },
        ],
      },
    ];
  },
};