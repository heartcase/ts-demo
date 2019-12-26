import {
  Reducer,
  EnhancedStore,
  Middleware,
  StateRecipes,
  StateValue,
  AnyAction,
  BundleState,
  RootState,
  NameSpace,
  StatePath,
  ActionCreator
} from './types/store';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Dispatch } from 'react';
import { get } from 'lodash';
import { sagas as rootSagas } from './sagas';

// Helpers
export const getEmptyObject = (): {} => ({});
export const getIdentity = (state: StateValue): StateValue => state;

// Redux Middlewares
export const combinedActionMiddleware: Middleware = store => next => (
  action
): Dispatch<AnyAction> | Array<Dispatch<AnyAction>> => {
  if (!Array.isArray(action)) {
    return next(action);
  }
  return action.map(item => store.dispatch(item));
};

// Create Store
export const configureStore = (rootReducer: Reducer = getIdentity, preloadedState: RootState = {}): EnhancedStore => {
  const sagaMiddleware = createSagaMiddleware();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store: EnhancedStore = createStore(
    rootReducer,
    preloadedState,
    composeEnhancer(applyMiddleware(sagaMiddleware, combinedActionMiddleware))
  );
  store.injectedReducers = {};
  store.injectedSagas = {};
  store.runSaga = sagaMiddleware.run;
  store.runSaga(rootSagas);
  return store;
};

export const createState = ({
  key,
  initialValue,
  namespace = '',
  actions = getEmptyObject,
  reducer = getIdentity,
  selectors = getEmptyObject,
  otherProps
}: StateRecipes): BundleState => {
  const accessor = namespace ? `${namespace}.${key}` : key;
  return {
    key,
    actions: {
      set: (x: StateValue): AnyAction => ({ type: `${accessor}.set`, value: x }),
      reset: (): AnyAction => ({ type: `${accessor}.reset` }),
      ...actions({ namespace, key }, otherProps)
    },
    reducer: (state = initialValue, action: AnyAction): StateValue => {
      switch (action.type) {
        case `${accessor}.set`:
          return action.value;
        case `${accessor}.reset`:
          return initialValue;
        default:
          return reducer(state, { namespace, key }, otherProps);
      }
    },
    selectors: {
      get: (state: StateValue): StateValue => get(state, accessor),
      ...selectors({ namespace, key }, otherProps)
    }
  };
};

export const buildNameSpace = ({
  recipes,
  namespace = ''
}: {
  recipes: Array<StateRecipes>;
  namespace: string;
}): NameSpace => {
  const states = recipes.map((recipe: StateRecipes) => createState({ ...recipe, namespace }));
  const reducer = combineReducers(Object.assign({}, ...states.map(state => ({ [state.key]: state.reducer }))));
  const actions = Object.assign({}, ...states.map(state => ({ [state.key]: state.actions })));
  const selectors = Object.assign({}, ...states.map(state => ({ [state.key]: state.selectors })));
  const resetNamespace = states.map(state => state.actions.reset());
  return {
    reducer,
    actions,
    selectors,
    resetNamespace
  };
};

export const injectReducer = (store: EnhancedStore, key: string, reducer: Reducer): void => {
  store.injectedReducers[key] = reducer;
  store.replaceReducer(combineReducers(store.injectedReducers));
};

const defaultOtherProps = {};

export const requestAction = (
  { namespace, key }: StatePath,
  otherProps: { request?: object } = defaultOtherProps
): Record<string, ActionCreator<AnyAction>> => {
  const accessor = namespace ? `${namespace}.${key}` : key;
  const { request: defaultRequest } = otherProps;
  return {
    request: (
      request: object,
      preRequestAction: AnyAction,
      callbackAction: AnyAction,
      errorAction: AnyAction
    ): AnyAction => ({
      type: `__request__`,
      request: Object.assign({}, defaultRequest, request),
      callbackAction,
      errorAction,
      accessor,
      preRequestAction
    })
  };
};
