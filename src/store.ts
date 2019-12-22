import {
  Reducer,
  InjectedStore,
  Middleware,
  Action,
  StateRecipes,
  StateValue,
  AnyAction,
  BundleState,
  ReduxState,
  NameSpace
} from './types/store';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Dispatch } from 'react';
import { get } from 'lodash';

// Helpers
export const getEmptyObject = (): {} => ({});
export const getIdentity = (state: StateValue): StateValue => state;

// Redux Middlewares
export const combinedActionMiddleware: Middleware = store => next => (
  action
): Dispatch<Action> | Array<Dispatch<Action>> => {
  if (!Array.isArray(action)) {
    return next(action);
  }
  return action.map(item => store.dispatch(item));
};

// Create Store
export const configureStore = (rootReducer: Reducer = getIdentity, preloadedState: ReduxState = {}): InjectedStore => {
  const sagaMiddleware = createSagaMiddleware();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store: InjectedStore = createStore(
    rootReducer,
    preloadedState,
    composeEnhancer(applyMiddleware(sagaMiddleware, combinedActionMiddleware))
  );
  store.injectedReducers = {};
  store.injectedSagas = {};
  store.runSaga = sagaMiddleware.run;
  return store;
};

export const createState = ({
  key,
  initialValue,
  namespace = '',
  actions = getEmptyObject,
  reducer = getIdentity,
  selectors = getEmptyObject
}: StateRecipes): BundleState => {
  const accessor = namespace ? `${namespace}.${key}` : key;
  return {
    key,
    actions: {
      set: (x: StateValue): AnyAction => ({ type: `${accessor}.set`, value: x }),
      reset: (): AnyAction => ({ type: `${accessor}.reset` }),
      ...actions({ namespace, key })
    },
    reducer: (state = initialValue, action: AnyAction): StateValue => {
      switch (action.type) {
        case `${accessor}.set`:
          return action.value;
        case `${accessor}.reset`:
          return initialValue;
        default:
          return reducer(state, { namespace, key });
      }
    },
    selectors: {
      get: (state: StateValue): StateValue => get(state, accessor),
      ...selectors({ namespace, key })
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
  return {
    reducer,
    actions,
    selectors
  };
};

export const injectReducer = (store: InjectedStore, key: string, reducer: Reducer): void => {
  store.injectedReducers[key] = reducer;
  store.replaceReducer(combineReducers(store.injectedReducers));
};
