// required for tslint --type-check to work, don't believe me?
// try to remove this shit and you'll see for yourself (:
declare module '*.css' {
  const classes: any;
  export = classes;
}

// required to be able to import .json files
// using the json-loader for webpack,
// this can be useful e.g. in tests
declare module '*.json' {
  const json: any;
  export default json;
}

declare module 'redux-devtools-extension';
