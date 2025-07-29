/**
 * Module dependencies.
 */

import app from './app';
import http from 'http';
import { dbReady } from './models';
import { useRubickShop } from './hooks';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3600');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

dbReady().then(() => {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  useRubickShop();
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
// 定义ANSI颜色转义序列
const colors = {
  // 文本颜色
  reset: '\x1b[0m',
  blue: '\x1b[34m',
};
/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  console.log(`\nListening on ${colors.blue}http://localhost:${port}${colors.reset}\n`);
}
