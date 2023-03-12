const { createProxyMiddleware } = require('http-proxy-middleware');

const isTest = process.env.NODE_ENV === "test";

module.exports = function(app) {
  if(isTest){
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'https://localhost:4000',
        changeOrigin: true,
      })
    );
  }
};