import { Task } from 'redux-saga';
import { Middleware } from 'redux';

import {
  CollectObjectCreators,
  CollectReducerCreators,
  StateRecipe,
  Reducer,
  ReducerCreator,
  Action,
  StateBundle,
  ConfigureStore,
  EnhancedStore,
  NamespaceBundle,
  GetActionCreators,
  RequestActionProps
} from './types/store';

import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { get } from 'lodash';

// Unit Functions
export const emptyObjectCreator = () => ({});
export const identityReducer: Reducer = state => state;
export const identityReducerCreator: ReducerCreator = () => identityReducer;

// Composing Function Helpers
export const collectObjectCreator: CollectObjectCreators = (...objectCreators) => (...args) =>
  Object.assign({}, ...objectCreators.map(creator => creator(...args)));

export const collectReducerCreator: CollectReducerCreators = (...reducerCreators) => (
  fallbackReducer,
  statePath,
  otherProps
) =>
  reducerCreators.reduce((reducer, reducerCreator) => reducerCreator(reducer, statePath, otherProps), fallbackReducer);

// Tool Functions
export const getStatePath = (key: string, namespace: string): string => `${namespace}.${key}`;

// Redux Middlewares
export const combinedActionMiddleware: Middleware = () => next => action => {
  if (!Array.isArray(action)) {
    return next(action);
  }
  next({ type: `${action.toString()} ❗` });
  action.map(item => next(item));
  return next({ type: `${action.toString()} ✅` });
};

// Create StateBundle from StateRecipe
export const createStateBundle = <T = any, K = any>({
  key,
  namespace,
  initialValue,
  reducerCreator = identityReducerCreator,
  getActionCreators = emptyObjectCreator,
  getSelector = emptyObjectCreator,
  otherProps
}: StateRecipe<T, K>): StateBundle<T> => {
  const statePath = getStatePath(key, namespace);
  return {
    key,
    actions: {
      set: (value: T) => ({ type: `${statePath}.set`, value }),
      reset: () => ({ type: `${statePath}.reset` }),
      ...getActionCreators(statePath, otherProps)
    },
    reducer: (state: T = initialValue, action: Action) => {
      switch (action.type) {
        case `${statePath}.set`:
          return action.value;
        case `${statePath}.reset`:
          return initialValue;
        default:
          return reducerCreator(identityReducer, statePath, otherProps)(state, action);
      }
    },
    selectors: {
      get: (state: T) => get(state, statePath),
      ...getSelector(statePath, otherProps)
    }
  };
};

// Build Up NamespaceBundle from StateRecipes
export const buildNamespaceBundle = (recipes: StateRecipe[], namespace: string): NamespaceBundle => {
  const states = recipes.map(recipe => createStateBundle({ ...recipe, namespace }));
  const stateReducer = combineReducers(Object.assign({}, ...states.map(state => ({ [state.key]: state.reducer }))));
  const initialState = Object.assign({}, ...recipes.map(state => ({ [state.key]: state.initialValue })));
  const reducer: Reducer = (state = initialState, action) =>
    action.type === `${namespace}.__reset__` ? initialState : stateReducer(state, action);
  const actions = Object.assign({}, ...states.map(state => ({ [state.key]: state.actions })));
  const selectors = Object.assign({}, ...states.map(state => ({ [state.key]: state.selectors })));
  const resetAction = { type: `${namespace}.__reset__` };
  return {
    reducer,
    actions,
    selectors,
    resetAction
  };
};

// Create Store
export const configureStore: ConfigureStore = (rootReducer, preloadedState) => {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store: EnhancedStore = createStore(
    rootReducer,
    preloadedState,
    composeEnhancer(applyMiddleware(sagaMiddleware, combinedActionMiddleware))
  );
  store.injectedReducers = {};
  store.injectedSagas = {};
  store.runSaga = sagaMiddleware.run;
  store.currentReducer = rootReducer;
  return store;
};

// Inject Reducer
export const injectReducer = (store: EnhancedStore, namespace: string, reducer: Reducer) => {
  store.injectedReducers[namespace] = reducer;
  store.currentReducer = combineReducers(store.injectedReducers);
  store.replaceReducer(store.currentReducer);
};

export const injectSaga = (store: EnhancedStore, namespace: string, task: Task, id: string, mode = 'takeEvery') => {
  const sagas = get(store, ['injectedSagas', namespace], []);
  const taskBundle = {
    task,
    id,
    mode
  };
  switch (mode) {
    case 'takeEvery': {
      store.injectedSagas[namespace] = [...sagas, taskBundle];
      return;
    }
    case 'takeFirst': {
      const hadTask = sagas.find(bundle => bundle.id === id);
      if (hadTask) return;
      store.injectedSagas[namespace] = [...sagas, taskBundle];
      return;
    }
    case 'takeLast': {
      const hadTasks = sagas.filter(bundle => bundle.id === id);
      if (hadTasks) hadTasks.forEach(bundle => bundle.task.cancel());
      const newSagas = sagas.filter(bundle => bundle.id !== id);
      store.injectedSagas[namespace] = [...newSagas, taskBundle];
      return;
    }
    default:
      return;
  }
};

// Extendable ActionCreator
export const requestActionCreator: GetActionCreators<RequestActionProps> = (statePath, otherProps) => {
  const { request: defaultRequest, mode } = otherProps;
  return {
    request: (
      request: object,
      preRequestAction: Action,
      callbackAction: Action,
      errorAction: Action,
      cancelAction: Action
    ) => ({
      type: `__request__`,
      request: Object.assign({}, defaultRequest, request),
      callbackAction,
      errorAction,
      cancelAction,
      statePath,
      preRequestAction,
      mode
    })
  };
};

export const arrayActionCreator: GetActionCreators = statePath => {
  return {
    pop: () => ({ type: `${statePath}.pop` }),
    shift: () => ({ type: `${statePath}.shift` })
  };
};

// Extendable ReducerCreator
export const arrayReducerCreator: ReducerCreator<any[]> = (fallbackReducer, statePath) => (state, action) => {
  switch (action.type) {
    case `${statePath}.pop`:
      return state.slice(0, state.length - 1);
    case `${statePath}.shift`:
      return state.slice(1);
    default:
      return fallbackReducer(state, action);
  }
};
