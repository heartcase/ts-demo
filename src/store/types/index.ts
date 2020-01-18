import { Store } from 'redux';
import { Saga, Task } from 'redux-saga';
import { AxiosRequestConfig } from 'axios';
import { Maybe } from '../../types';

// Redux
export type Action<T = any> = {
  type: string;
  payload?: T;
  actions?: Action[];
  [otherProps: string]: any;
};
export type Selector<T = any, S = any> = (state: T) => S;
export type Reducer<T = any> = (state: T, action: Action) => T;
export type ActionCreator<T = any> = (...args: Parameters<any>) => Action<T>;

// Sagas
export type SagaBundle = {
  id: string;
  mode: string;
  task: Task;
};

// Request
export type RequestActionPayload = {
  request: AxiosRequestConfig;
  path: string;
  callbacks?: {
    onRequestAction?: Action;
    successAction?: Action;
    errorAction?: Action;
    cancelAction?: Action;
  };
};

export type RequestResponse = { data: any };

// Store
export type RunSaga = (saga: Saga, ...args: Parameters<Saga>) => Task;
export type InjectState = (path: string, state: any) => void;
export type InjectSaga = (sagaBundle: SagaBundle) => void;

export type EnhancedStore = Store<any, Action> & {
  initialState: any;
  injectedSagas: SagaBundle[];
  injectedStates: string[];
  runSaga: RunSaga;
  injectState: InjectState;
  injectSaga: InjectSaga;
};

export type ConfigureStore = (
  rootReducer: Reducer,
  preloadedState: any
) => EnhancedStore;

// Reducer

export type ReducerMap = { [method: string]: Reducer };
export type LoadType = (
  type: string
) => { path: string[]; method: Maybe<Reducer> };
export type CreateState = (path: string[], value: any) => any;

// Recipe

export type StateRecipe = {
  path: string;
  initialValue: any;
  otherProps?: any;
};

export type ActionCreatorMap = {
  [method: string]: ActionCreator;
};

export type SelectorMap = {
  [method: string]: Selector;
};

export type StateBundle<T = any> = {
  path: string;
  actions: ActionCreatorMap;
  preloadedState: T;
};

export type NestedActionCreatorMap = {
  [path: string]: ActionCreator | NestedActionCreatorMap;
};

export type NestedSelectorMap = {
  [path: string]: Selector | NestedSelectorMap;
};

export type NamespaceBundle<T = any> = {
  path: string;
  actions: NestedActionCreatorMap;
  preloadedState: T;
};
