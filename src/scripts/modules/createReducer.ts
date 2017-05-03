import { combineReducers } from 'redux';

// every module should export a reducer as a default in index.ts

const pattern = /^\.\/([a-z]+)\/index\.ts$/i;
export const ctx = require.context('./', true, /^\.\/([a-z]+)\/index\.ts$/i);

export default function() {
  const reducers = ctx.keys().reduce(
    (acc: any, key) => {
      const matches = pattern.exec(key);
      const name = matches![1];
      const entry = ctx(key);
      acc[name] = (entry as any).default;
      return acc;
    },
    {}
  );

  return combineReducers(reducers);
}
