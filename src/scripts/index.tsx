import * as React from 'react';
import { render } from 'react-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import { AppState } from 'modules';
import createStore from 'store';
import { App, AppProps } from 'containers';

const initialState: AppState = {
  quotes: {
    inputs: {},
    values: {},
  },
};

const store: Store<AppState> = createStore(initialState);

const Hot = (El: React.ReactElement<AppProps>) => (
  <AppContainer>
    <Provider store={store}>
      {El}
    </Provider>
  </AppContainer>
);

const rootElement = document.getElementById('root');
render(Hot(<App />), rootElement);

if (module.hot) {
  module.hot.accept('containers/App', () => {
    const NextApp = (require('containers/App') as any).default;
    render(Hot(<NextApp />), rootElement);
  });
}
