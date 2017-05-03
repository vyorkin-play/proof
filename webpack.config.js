/* eslint-disable comma-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { join, resolve } = require('path');
const { filter, pick, is } = require('ramda');
const chalk = require('chalk');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

const pkg = require('./package');

const compact = filter(Boolean);

const paths = {
  src: resolve('src'),
  assets: resolve('src/assets'),
  templates: resolve('src/templates'),
  styles: resolve('src/styles'),
  scripts: resolve('src/scripts'),
};

const getKnownEnvironments = pick([
  'test',
  'development',
  'production',
]);

module.exports = (env) => {
  const environments = getKnownEnvironments(env);
  const environmentName = Object.keys(environments)
    .find(key => !!env[key]) || 'production';

  const evaluate = (fn) => {
    if (is(Function, fn)) return fn();
    return fn;
  };

  const ifVar = (name, value, fallback) => evaluate(env[name] ? value : fallback);
  const ifEnv = (name, maybeFn, fallback) => {
    const names = is(Array, name) ? name : [name];
    if (names.includes(environmentName)) {
      return evaluate(maybeFn);
    } else if (fallback !== undefined) {
      return evaluate(fallback);
    }
    return null;
  };

  const cssLoaders = {
    app: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          sourceMap: ifEnv('development', true, false),
          localIdentName: ifEnv(
            'development',
            '[local]--[hash:base64:5]',
            '[hash:base64:5]'
          ),
        },
      },
      'postcss-loader',
    ],
    vendor: [{ use: 'css-loader' }],
  };

  const getCSSLoader = (kind) => {
    const loaders = combineLoaders(cssLoaders[kind]);
    return ifEnv(
      'production',
      () => ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: combineLoaders(cssLoaders[kind]),
      }),
      ['style-loader', loaders]
    );
  };

  return {
    entry: {
      app: compact([
        ifEnv('development', 'react-hot-loader/patch'),
        ifEnv('development', 'webpack-hot-middleware/client'),
        './scripts/index',
      ]),
    },
    output: {
      filename: ifEnv('production', '[name].[chunkhash].js', '[name].js'),
      chunkFilename: '[name].chunk.js',
      sourceMapFilename: ifEnv('development', '[file].[hash].js.map', '[file].js.map'),
      path: resolve('dist'),
      publicPath: '',
      pathinfo: !env.production,
    },
    context: paths.src,
    devtool: '#source-map',
    bail: ifEnv('production', true, false),
    resolve: {
      modules: [
        paths.scripts,
        'node_modules',
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: { assets: paths.assets },
    },
    module: {
      rules: compact([
        ifEnv('development', {
          test: /\.jsx?$/,
          enforce: 'pre',
          use: 'source-map-loader',
        }),
        {
          test: /\.tsx?$/,
          use: [
            'react-hot-loader/webpack',
            'ts-loader?silent=true',
          ],
          include: paths.scripts,
        },
        {
          test: /\.css$/,
          use: getCSSLoader('app'),
          exclude: /node_modules/,
          include: [
            paths.styles,
            paths.scripts,
          ],
        },
        {
          test: /\.css$/,
          use: getCSSLoader('vendor'),
          include: /node_modules/,
        },
        {
          test: /\.pug$/,
          use: 'pug-loader',
          include: paths.templates,
        },
        {
          test: /\.txt(\?.+)?$/,
          use: 'raw-loader',
          include: [
            paths.assets,
            paths.scripts,
          ],
        },
        {
          test: /\.(jpe?g|png|gif)(\?.+)?$/,
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            prefix: 'images',
            limit: 1024,
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf)(\?.+)?$/,
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            prefix: 'fonts',
            limit: 4096,
          },
        },
      ]),
    },
    plugins: compact([
      ifEnv('development', () => new webpack.DllReferencePlugin({
        context: resolve('dist'),
        manifest: require('./dist/vendor-manifest'), // eslint-disable-line global-require
      })),
      new HtmlWebpackPlugin({
        title: pkg.description,
        template: 'templates/index.pug',
      }),
      ifEnv('development', () => new AddAssetHtmlPlugin({
        filepath: require.resolve('./dist/vendor.dll'),
        includeSourcemap: ifEnv('development', true, false),
      })),
      new ProgressBarPlugin({
        width: 12,
        format: `[${chalk.blue(':bar')}] ${chalk.green.bold(':percent')} ${chalk.magenta(':msg')} (:elapsed seconds)`,
        clear: true,
        summary: false,
      }),
      new webpack.DefinePlugin({
        __DEVELOPMENT__: environmentName === 'development',
        __PRODUCTION__: environmentName === 'production',
        __ENV__: JSON.stringify(environmentName),
        __VERSION__: pkg.version,
        __SETTINGS__: {},
        'process.env': { NODE_ENV: JSON.stringify(environmentName) },
      }),
      ifEnv('development', () => new webpack.HotModuleReplacementPlugin()),
      ifEnv('production', () => new webpack.LoaderOptionsPlugin({
        minimize: !!env.unminified,
        debug: !!env.debug,
      })),
      ifEnv('production', () => new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
      })),
      ifEnv('production', () => new ExtractTextPlugin('[name].[chunkhash].css')),
    ]),
  };
};
/* eslint-enable comma-dangle */
