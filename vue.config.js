const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/chat/',
    devServer: {
        proxy: {
            "/apichat": {
                target: "http://localhost:8083",
                pathRewrite: {
                    "^/apichat": "" // 需要rewrite的,
                }
            }
        }
    }
});
