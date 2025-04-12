const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config) {
  // Add Node.js polyfills
  config.plugins = (config.plugins || []).concat(new NodePolyfillPlugin());

  // Add fallback for 'node:readline'
  config.resolve.fallback = {
    ...config.resolve.fallback,
    readline: require.resolve('readline'),
  };

  return config;
};
