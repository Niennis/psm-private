module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/login',
        options: {
          redirectStatusCode: 302,
        },
      },
    ];
  },
};
