const { javaScriptLoader, typeScriptLoader, preComplieLoader } = require('./loaders');

const { htmlWebpackPlugin } = require('./plugins');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [javaScriptLoader, typeScriptLoader, preComplieLoader]
  },
  plugins: [htmlWebpackPlugin],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
