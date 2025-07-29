module.exports = {
    globDirectory: 'build/',
    globPatterns: [
      '**/*.{html,js,css,png,jpg,jpeg,gif,svg,woff2,woff,ttf,eot,json}',
    ],
    swDest: 'build/service-worker.js',
    clientsClaim: true,
    skipWaiting: true,
  };
  