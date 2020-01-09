import { Store, Middleware, Dispatch, AnyAction, ActionCreator, Reducer } from 'redux';
import { Saga, Task } from 'redux-saga';

// Action
export { AnyAction, ActionCreator };

// Reducer
export { Reducer };

// Saga
export { Saga };

// State
declare interface RootState {
  [namespace: string]: StateValue;
}
declare type StateValue = number | boolean | string | null | undefined | object | Array<StateValue>;
declare interface StatePath {
  key: string;
  namespace: string;
}

export { RootState, StateValue, StatePath };

// Selector
declare type Selector = (state: StateValue) => StateValue;

export { Selector };

// Store
declare interface DispatchCombinedAction {
  (action: Array<AnyAction>): Array<AnyAction>;
}

declare type EnhancedStore = Store & {
  injectedSagas: Record<string, Saga>;
  injectedReducers: Record<string, Reducer>;
  runSaga(saga: Saga, ...args: Parameters<Saga>): Task;
  dispatch: Dispatch & DispatchCombinedAction;
  currentReducer: Reducer;
};

export { EnhancedStore, DispatchCombinedAction, Middleware };

// State Configs
export interface StateRecipes {
  key: string;
  initialValue: StateValue;
  namespace?: string;
  actions?: Function;
  reducer?: Function;
  selectors?: Function;
  otherProps?: StateValue;
}

export interface BundleState {
  key: string;
  actions: Record<string, ActionCreator<AnyAction>>;
  reducer: Reducer;
  selectors: Record<string, Selector>;
}

export interface NameSpace {
  reducer: Reducer;
  actions: Record<string, Record<string, ActionCreator<AnyAction>>>;
  selectors: Record<string, Record<string, Selector>>;
  resetNamespace?: AnyAction;
}
