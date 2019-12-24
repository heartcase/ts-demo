import { takeEvery, call, put } from 'redux-saga/effects';
import { AnyAction } from './types/store';
import axios from 'axios';

function* request(action: AnyAction): Generator<AnyAction, void, unknown> {
  const { request, callbackAction, errorAction, accessor } = action;
  try {
    const value = yield call(() => axios(request));
    yield callbackAction && put(callbackAction);
    yield put({ type: `${accessor}.set`, value });
  } catch (error) {
    yield errorAction && put(errorAction);
  }
}

export function* sagas(): Generator<AnyAction, void, unknown> {
  yield takeEvery('__request__', request);
}
