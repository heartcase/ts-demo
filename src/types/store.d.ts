import { Reducer, Store, Middleware, Action, AnyAction, Dispatch, ActionCreator } from 'redux';
import { Saga, Task } from 'redux-saga';

export type InjectedSagas = {
  [key: string]: Saga;
};
export type InjectedReducers = {
  [key: string]: Reducer;
};

export interface DispatchCombinedAction {
  (action: Array<AnyAction>): Array<AnyAction>;
}

export type InjectedStore = Store & {
  injectedSagas: InjectedSagas;
  injectedReducers: InjectedReducers;
  runSaga(saga: Saga, ...args: Parameters<Saga>): Task;
  dispatch: Dispatch & DispatchCombinedAction;
};

export interface ReduxState {
  [key: string]: StateValue;
}

export type StateValue = number | boolean | string | null | undefined | ReduxState;

export interface Accessor {
  key: string;
  namespace: string;
}

export type Selector = (state: StateValue) => StateValue;

export interface StateRecipes {
  key: string;
  initialValue: StateValue;
  namespace?: string;
  actions?: (accessor: Accessor) => Record<string, Action>;
  reducer?: (state: StateValue, accessor: Accessor) => StateValue;
  selectors?: (accessor: Accessor) => Record<string, Selector>;
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
}

export { Reducer, Saga, Store, Middleware, Action, AnyAction };
