module.exports.preComplieLoader = {
  enforce: 'pre',
  test: /\.[jt]sx?$/,
  exclude: /node_modules/,
  use: ['eslint-loader', 'prettier-loader']
};

module.exports.typeScriptLoader = {
  test: /\.tsx?$/,
  use: ['babel-loader', 'ts-loader'],
  exclude: /node_modules/
};

module.exports.javaScriptLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/
};
