const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/stomp-websocket", {
      target: "http://localhost:8083",
      changeOrigin: true,
      ws: true,
    }),
  );
};
