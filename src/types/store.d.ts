import { Reducer, Store } from "redux";
import { Saga, SagaMiddleware, Task } from "redux-saga";

export type InjectedSagas = {
  [key: string]: Saga;
};
export type InjectedReducers = {
  [key: string]: Reducer;
};

export type InjectedStore = Store & {
  injectedSagas: InjectedSagas;
  injectedReducers: InjectedReducers;
  runSaga(saga: Saga, ...args: Parameters<Saga>): Task;
};

export { Reducer, Saga };
