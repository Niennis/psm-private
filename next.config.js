module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
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