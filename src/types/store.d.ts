import { Reducer, Store, Middleware, Action, AnyAction } from 'redux';
import { Saga, Task } from 'redux-saga';

export type InjectedSagas<S extends Saga> = {
  [key: string]: S;
};
export type InjectedReducers<R extends Reducer> = {
  [key: string]: R;
};

export type InjectedStore<S extends Saga, R extends Reducer> = Store & {
  injectedSagas: InjectedSagas<S>;
  injectedReducers: InjectedReducers<R>;
  runSaga(saga: Saga, ...args: Parameters<Saga>): Task;
};

export interface ReduxState {
  [key: string]: StateValue;
}

export type StateValue = number | boolean | string | null | undefined | ReduxState;

export { Reducer, Saga, Store, Middleware, Action, AnyAction };

export interface Accessor {
  key: string;
  namespace: string;
}

export type Selector = (state: StateValue) => StateValue | Array<StateValue>;
export type ActionCreator = (data: StateValue) => AnyAction;

export interface CreateState {
  key: string;
  initialValue: StateValue;
  namespace: string;
  actions: (accessor: Accessor) => Record<string, Action>;
  reducer: (state: StateValue, accessor: Accessor) => StateValue;
  selectors: (accessor: Accessor) => Record<string, Selector>;
}

export interface NameSpace {
  key: string;
  actions: Record<string, ActionCreator>;
  reducer: Reducer;
  selectors: Record<string, Selector>;
}
