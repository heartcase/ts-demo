import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { sagas } from './sagas';
import App from './components/App';
import { configureStore, identityReducer } from './store';

const store = configureStore(identityReducer, sagas, {});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
