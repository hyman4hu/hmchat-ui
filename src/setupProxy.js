const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // app.use(
    //     createProxyMiddleware("/api", {
    //         target: "http://36.153.0.228:8906",
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '^/api': '' //需要rewrite的,
    //         }
    //     })
    // );
    app.use(
        createProxyMiddleware("/stomp-websocket", {
            target: "http://localhost:18083",
            changeOrigin: true,
            ws: true,
        })
    );
};