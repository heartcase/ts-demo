import { Reducer, InjectedStore, Saga } from './types/store';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

// create store

export const configureStore = (rootReducer: Reducer, preloadedState: any): InjectedStore<Saga, Reducer> => {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store: InjectedStore<Saga, Reducer> = createStore(
    rootReducer,
    preloadedState,
    composeEnhancer(applyMiddleware(sagaMiddleware))
  );
  store.injectedReducers = {};
  store.injectedSagas = {};
  store.runSaga = sagaMiddleware.run;
  return store;
};
