const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9011',
        pathRewrite: {'^/api': ''},
        ws: false,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    resolve:{
      fallback:{
        "crypto": require.resolve("crypto-browserify/"),
        "stream": require.resolve("stream-browserify/"),
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http/"),
        "https": require.resolve("https-browserify/"),
        "os": require.resolve("os-browserify/"),
        "url": require.resolve("url/"),
        "buffer": require.resolve("buffer/")
      }
    }
  }
})
