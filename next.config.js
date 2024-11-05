module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier hostname
        port: '',       // Sin especificar puerto (cualquier puerto o ninguno)
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/login',
      },
    ];
  },
};
