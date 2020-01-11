import { Store, Dispatch } from 'redux';
import { Saga, Task } from 'redux-saga';

export type Action = {
  type: string;
  [payload: string]: any;
};
export type Selector<T = any> = (state: T) => any;
export type Reducer<T = any> = (state: T, action: Action) => T;

export type ObjectCreator<T = any> = (...args: Parameters<any>) => T;
export type ActionCreator = ObjectCreator<Action>;
export type ReducerCreator<T = any> = (fallbackReducer: Reducer<T>, statePath: string, otherProps?: any) => Reducer<T>;

export type CollectObjectCreators<T = any> = (...objectCreators: ObjectCreator<T>[]) => ObjectCreator<T>;
export type CollectReducerCreators<T = any> = (...reducerCreators: ReducerCreator<T>[]) => ReducerCreator<T>;

export type ConfigureStore = (rootReducer: Reducer, rootSagas: Saga, preloadedState: any) => EnhancedStore;

export interface DispatchCombinedAction<A extends Action = Action> {
  (action: A[]): A[];
}

export type EnhancedStore = Store & {
  injectedSagas: {
    [namespace: string]: Saga;
  };
  injectedReducers: {
    [namespace: string]: Reducer;
  };
  runSaga(saga: Saga, ...args: Parameters<Saga>): Task;
  dispatch: Dispatch & DispatchCombinedAction;
  currentReducer: Reducer;
};

export type GetActionCreators<K = any> = (statePath: string, otherProps: K) => { [type: string]: ActionCreator };
export type GetSelector<T = any, K = any> = (statePath: string, otherProps: K) => { [type: string]: Selector<T> };

export type StateRecipe<T = any, K = any> = {
  key: string;
  namespace?: string;
  initialValue: T;
  reducerCreator?: ReducerCreator<T>;
  getActionCreators?: GetActionCreators<K>;
  getSelector?: GetSelector<T, K>;
  otherProps?: K;
};

export type StateBundle<T = any> = {
  key: string;
  reducer: Reducer<T>;
  actions: { [type: string]: ActionCreator };
  selectors: { [type: string]: Selector<T> };
};

export type ReduxPath<T = any> = {
  [key: string]: {
    [type: string]: T;
  };
};

export type NamespaceBundle<T = any> = {
  reducer: Reducer<T>;
  actions: ReduxPath<ActionCreator>;
  selectors: ReduxPath<Selector<T>>;
  resetAction?: Action;
};

export type RequestActionProps = { request?: object };
