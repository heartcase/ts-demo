import {
  Reducer,
  InjectedStore,
  Saga,
  Middleware,
  Action,
  CreateState,
  StateValue,
  AnyAction,
  NameSpace,
  ReduxState
} from './types/store';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Dispatch } from 'react';
import { get } from 'lodash';

const getEmptyObject = (): {} => ({});
const getIdentity = (state: StateValue): StateValue => state;

export const createState = ({
  key,
  initialValue,
  namespace = '',
  actions = getEmptyObject,
  reducer = getIdentity,
  selectors = getEmptyObject
}: CreateState): NameSpace => {
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
        case `${namespace}.${key}.set`:
          return action.value;
        case `${namespace}.${key}.reset`:
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

// create store
const combinedActionMiddleware: Middleware = store => next => (action): Dispatch<Action> | Array<Dispatch<Action>> => {
  if (!Array.isArray(action)) {
    return next(action);
  }
  return action.map(item => {
    return store.dispatch(item);
  });
};

export const configureStore = (rootReducer: Reducer, preloadedState: ReduxState): InjectedStore<Saga, Reducer> => {
  const sagaMiddleware = createSagaMiddleware();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store: InjectedStore<Saga, Reducer> = createStore(
    rootReducer,
    preloadedState,
    composeEnhancer(applyMiddleware(sagaMiddleware, combinedActionMiddleware))
  );
  store.injectedReducers = {};
  store.injectedSagas = {};
  store.runSaga = sagaMiddleware.run;
  return store;
};
