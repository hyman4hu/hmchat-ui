const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/chat/',
    devServer: {
        proxy: {
            "/chatapi": {
                target: "http://localhost:8083",
                pathRewrite: {
                    "^/chatapi": "" // 需要rewrite的,
                }
            }
        }
    }
});
