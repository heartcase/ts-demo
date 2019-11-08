const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports.htmlWebpackPlugin = new HtmlWebpackPlugin({
  title: "My App",
  filename: "index.html",
  template: "src/index.html"
});
