module.exports = {
  cacheHandler: require.resolve('./src/utils/cache-handler.js'),
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