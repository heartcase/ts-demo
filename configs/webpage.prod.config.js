const {
  javaScriptLoader,
  typeScriptLoader,
  preComplieLoader
} = require("./loaders");

const { htmlWebpackPlugin } = require("./plugins");

module.exports = {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [javaScriptLoader, typeScriptLoader, preComplieLoader]
  },
  plugins: [htmlWebpackPlugin]
};
