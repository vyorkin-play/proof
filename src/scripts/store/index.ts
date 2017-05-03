import { Store, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import middlewareEnhancer from './middleware';
import { AppState, createRootReducer, reducersContext } from 'modules';

export default function(initialState: AppState): Store<AppState> {
  const creatorFactory = composeWithDevTools(middlewareEnhancer);
  const create = creatorFactory(createStore);
  const reducer = createRootReducer();
  const store = create(reducer, initialState)

  if (__DEVELOPMENT__) {
    (window as any).store = store;

    if (module.hot) {
      const contextId = (reducersContext as any).id;
      module.hot.accept(contextId, () => {
        const createNextReducer = (require('modules/createReducer') as any).default;
        const next = createNextReducer();
        store.replaceReducer(next);
      });
    }
  }

  return store;
}
