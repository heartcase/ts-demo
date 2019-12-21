import { Reducer, Store, Middleware, Action, AnyAction, Dispatch } from 'redux';
import { Saga, Task } from 'redux-saga';

export type InjectedSagas<S extends Saga> = {
  [key: string]: S;
};
export type InjectedReducers<R extends Reducer> = {
  [key: string]: R;
};

export interface DispatchCombinedAction<A extends Action = AnyAction> {
  <T extends A>(action: Array<T>): Array<T>;
}

export type InjectedStore<S extends Saga, R extends Reducer> = Store & {
  injectedSagas: InjectedSagas<S>;
  injectedReducers: InjectedReducers<R>;
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

export type Selector = (state: StateValue) => StateValue | Array<StateValue>;
export type ActionCreator = (data: StateValue) => AnyAction;

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
  actions: Record<string, ActionCreator>;
  reducer: Reducer;
  selectors: Record<string, Selector>;
}

export interface NameSpace {
  reducer: Reducer;
  actions: Record<string, Record<string, ActionCreator>>;
  selectors: Record<string, Record<string, Selector>>;
}

export { Reducer, Saga, Store, Middleware, Action, AnyAction };
