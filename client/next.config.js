module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/introduction',
        permanent: true, // A permanent redirect (301)
      },
    ];
  },
};
