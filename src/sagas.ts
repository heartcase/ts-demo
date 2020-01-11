import { takeEvery, call, put } from 'redux-saga/effects';
import axios from 'axios';

import { Action } from './types/store';

function* request(action: Action): Generator<Action, void, unknown> {
  const { request, callbackAction, errorAction, accessor, preRequestAction } = action;
  try {
    yield preRequestAction && put(preRequestAction);
    const response = yield call(() => axios(request));
    const {
      data: { value }
    } = response as { data: { value: any } };
    yield callbackAction && put(callbackAction(value));
    yield put({ type: `${accessor}.set`, value });
  } catch (error) {
    yield errorAction && put(errorAction(error));
  }
}

export function* sagas(): Generator<any, void, unknown> {
  yield takeEvery('__request__', request);
}
