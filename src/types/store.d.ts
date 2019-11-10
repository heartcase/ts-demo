import { Reducer, Store } from 'redux';
import { Saga, SagaMiddleware, Task } from 'redux-saga';

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

export { Reducer, Saga };
