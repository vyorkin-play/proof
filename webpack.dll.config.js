/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const webpack = require('webpack');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = () => ({
  devtool: '#source-map',
  entry: {
    vendor: [resolve('vendors.js')],
  },
  output: {
    path: resolve('dist'),
    filename: '[name].dll.js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      context: resolve('dist'),
      path: resolve('dist', '[name]-manifest.json'),
      name: '[name]',
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
});
