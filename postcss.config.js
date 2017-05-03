const { resolve } = require('path');

module.exports = ctx => ({
  map: ['development'].includes(ctx.env) ? ctx.map : false,
  from: ctx.form,
  to: ctx.to,
  plugins: {
    'postcss-import': {
      path: [resolve('src/styles')],
    },
    'postcss-svg': {
      paths: [resolve('src/assets/svg')],
      svgo: ctx.env === 'production',
    },
    'postcss-assets': {
      loadPaths: [
        'assets',
        'scripts',
      ],
      basePath: resolve('src'),
      cachebuster: ctx.env === 'production',
    },
    'postcss-size': {},
    'postcss-position': {},
    'postcss-cssnext': { warnForDuplicates: ctx.env === 'development' },
    'postcss-font-magician': {},
    'postcss-reporter': ctx.env === 'development' ? {} : false,
    'postcss-browser-reporter': ctx.env === 'development' ? { selector: 'body:after' } : false,
    cssnano: ctx.env === 'production' ? {} : false,
  },
});
