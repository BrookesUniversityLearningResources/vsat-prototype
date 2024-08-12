const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const backend = 'http://localhost:5000';

  app
    .use(
      '/api',
      createProxyMiddleware({
        target: backend,
        changeOrigin: true,
      })
    )
    .use(
      '/stories',
      createProxyMiddleware({
        target: backend,
        changeOrigin: true,
      })
    );
};
