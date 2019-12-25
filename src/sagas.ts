import { takeEvery, call, put } from 'redux-saga/effects';
import { AnyAction, StateValue } from './types/store';
import axios from 'axios';

function* request(action: AnyAction): Generator<AnyAction, void, unknown> {
  const { request, callbackAction, errorAction, accessor } = action;
  try {
    const response = yield call(() => axios(request));
    console.log(response);
    const {
      data: { value }
    } = response as { data: { value: StateValue } };
    yield callbackAction && put(callbackAction(value));
    yield put({ type: `${accessor}.set`, value });
  } catch (error) {
    yield errorAction && put(errorAction(error));
    console.log(error);
  }
}

export function* sagas(): Generator<AnyAction, void, unknown> {
  yield takeEvery('__request__', request);
}
