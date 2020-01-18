import { Middleware } from 'redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { get, merge } from 'lodash';
import createSagaMiddleware from 'redux-saga';

import { ConfigureStore, EnhancedStore } from './types';
import { request } from './sagas';
import { dummyReducer } from './reducer';

// Store Factory
export const configureStore: ConfigureStore = (
  rootReducer = dummyReducer,
  preloadedState = {}
) => {
  let store: EnhancedStore = null;
  const sagaMiddleware = createSagaMiddleware();

  // Asynchronous Action Resolve Middleware
  const asyncMiddleware: Middleware = () => next => action => {
    // get action type
    const path = action.type.split('@');
    const type = path.pop();

    // handle Ajax request
    // Inject task into store to make the task cancelable
    if (type === 'request') {
      const task = store.runSaga(request, action);
      const id = get(action, 'payload.id', path[0]);
      const mode = get(action, 'payload.mode', 'takeEvery');
      const taskBundle = { id, mode, task };
      store.injectSaga(taskBundle);
    }
    return next(action);
  };
  const composeEnhancer =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancer(applyMiddleware(sagaMiddleware, asyncMiddleware))
  );

  // Load new namespace when new container mounted
  store.injectState = (path, newState) => {
    store.initialState = merge({}, store.initialState, newState);
    // Refresh Reducer's initialValue
    store.replaceReducer((state = store.initialState, action) =>
      rootReducer(state, action)
    );
    // If the state has load, do nothing
    if (store.injectedStates.includes(path)) return;
    // dispatch initialization action to reset namespace
    // Rename set Action by wrapping a INIT complex action
    store.dispatch({
      type: `${path}@INIT`,
      actions: [{ type: `${path}@set`, payload: get(newState, path) }]
    });
    store.injectedStates.push(path);
  };
  store.injectedStates = [];

  // Add new task to the injectedSagas
  store.injectSaga = sagaBundle => {
    // keep only running task
    const sagas = get(store, ['injectedSagas'], []).filter(bundle =>
      bundle.task.isRunning()
    );
    // adjust task behavior
    const { mode, id } = sagaBundle;
    switch (mode) {
      case 'takeEvery': {
        store.injectedSagas = [...sagas, sagaBundle];
        return;
      }
      case 'takeFirst': {
        const hadTask = sagas.find(bundle => bundle.id === id);
        if (hadTask) return;
        store.injectedSagas = [...sagas, sagaBundle];
        return;
      }
      case 'takeLast': {
        const hadTasks = sagas.filter(bundle => bundle.id === id);
        if (hadTasks) hadTasks.forEach(bundle => bundle.task.cancel());
        const newSagas = sagas.filter(bundle => bundle.id !== id);
        store.injectedSagas = [...newSagas, sagaBundle];
        return;
      }
      default:
        return;
    }
  };
  store.injectedSagas = [];
  store.runSaga = sagaMiddleware.run;
  store.initialState = preloadedState;
  return store;
};
