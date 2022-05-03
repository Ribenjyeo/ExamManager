const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/login',
    createProxyMiddleware({
      target: 'https://localhost:7242',
      changeOrigin: true,
      secure: false
    })
  ),
  app.use(
    '/user',
    createProxyMiddleware({
      target: 'https://localhost:7242',
      changeOrigin: true,
      secure: false
    })
  );
};