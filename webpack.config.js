const merge = require('webpack-merge');
const path = require('path');

// Disambiguate configs between different environments
const getEnvConfig = env => {
  switch (env) {
    case 'production':
      return require('./configs/webpage.prod.config');
    case 'development':
      return require('./configs/webpage.dev.config');
    default:
      return require('./configs/webpage.prod.config');
  }
};

// common config goes here
const commonConfig = {
  // Do not create an entry for vendors or other stuff
  // that is not the starting point of execution.
  // Use optimization.splitChunks
  entry: {
    main: './src/'
  },
  // Attempt to resolve these extensions in order.
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.d.ts']
  }
};

module.exports = function(env) {
  // NODE_ENV set by command line config
  const envConfig = getEnvConfig(env.NODE_ENV);
  // combine common config and env config
  return merge(commonConfig, envConfig);
};
