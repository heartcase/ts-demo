const {
  javaScriptLoader,
  typeScriptLoader,
  preComplieLoader
} = require("./loaders");

const { htmlWebpackPlugin } = require("./plugins");

module.exports = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [javaScriptLoader, typeScriptLoader, preComplieLoader]
  },
  plugins: [htmlWebpackPlugin]
};
