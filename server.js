/* eslint-disable import/no-extraneous-dependencies */
const { join } = require('path');
const webpack = require('webpack');
const express = require('express');
const http = require('http');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const ioFactory = require('socket.io');
/* eslint-enable import/no-extraneous-dependencies */

const getWebpackConfig = require('./webpack.config');

const app = express();
const tickerApp = express();
const tickerServer = http.createServer(tickerApp);

const io = ioFactory(tickerServer);
const webpackConfig = getWebpackConfig({ development: true });
const compiler = webpack(webpackConfig);

app.use(devMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  historyApiFallback: true,
  noInfo: true,
  stats: 'errors-only',
}));

app.use(hotMiddleware(compiler));
app.get('*', (req, res, next) => {
  const filename = join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    return res.end();
  });
});

const createTickEmitter = (socket, { row, col }) => () =>
  socket.emit('tick', { row, col, value: Math.floor(Math.random() * 100) });

io.on('connection', (socket) => {
  socket.intervals = {};
  socket.on('start', ({ row, col, interval = 1000 }) => {
    const emitter = createTickEmitter(socket, { row, col });
    if (!socket.intervals[row]) {
      socket.intervals[row] = {};
    }
    socket.intervals[row][col] = setInterval(emitter, interval);
  });
  socket.on('stop', ({ row, col }) => {
    clearInterval(socket.intervals[row][col]);
    delete socket.intervals[row][col];
  });
});

/* eslint-disable no-console */
app.listen(3000, (err) => {
  if (err) console.error(err);
});
tickerServer.listen(3001, (err) => {
  if (err) console.error(err);
});
/* eslint-enable no-console */
