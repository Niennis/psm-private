const path = require("path");

module.exports = {
  cacheHandler: require.resolve('./src/utils/cache-handler.js'),
  // distDir: '.next', // Mantener el estándar.
  compress: true, // Habilita compresión por defecto.
  swcMinify: true,
  productionBrowserSourceMaps: false,
  experimental: {
    // optimizePackageImports: [ // Agrupa imports de MUI y otras librerías
    //   '@mui/material',
    //   '@mui/icons-material',
    //   '@fullcalendar/react'
    // ],
    esmExternals: 'loose', // Reduce duplicación de dependencias
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    formats: ['image/webp'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ckeditor/ckeditor5-react': path.resolve(__dirname, 'node_modules/@ckeditor/ckeditor5-react'),
      '@ckeditor': path.resolve(__dirname, 'node_modules/@ckeditor'),
      'ckeditor5': path.resolve(__dirname, 'node_modules/ckeditor5'),
    };

    // config.module.rules.push({
    //   test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
    //   use: ['raw-loader'],
    // });

    // config.module.rules.push({
    //   test: /ckeditor\.css$/,
    //   use: ["style-loader", "css-loader"],
    // });
    config.module.rules.push({
      test: /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
      use: { loader: 'babel-loader' }
    });

    return config;
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