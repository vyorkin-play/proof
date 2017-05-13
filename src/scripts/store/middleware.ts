import { Middleware, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

function getEnvMiddleware(): Middleware[] {
  // if (__DEVELOPMENT__) {
  //   const { createLogger } = require('redux-logger') as any;
  //   const logger = createLogger({ level: 'info', collapsed: true });
  //   return [logger];
  // }
  return [];
}

const common: any[] = [thunk];
const env = getEnvMiddleware();
const middleware = env.concat(common);

export default applyMiddleware(...middleware);
