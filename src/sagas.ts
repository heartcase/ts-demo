import { call, put, cancelled } from 'redux-saga/effects';
import axios from 'axios';

import { Action } from './types/store';

export function* request(action: Action) {
  let cancel = new Function();
  const CancelToken = axios.CancelToken;
  const { request, callbackAction, errorAction, accessor, preRequestAction, cancelAction } = action;
  request.cancelToken = new CancelToken(c => (cancel = c));
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
  } finally {
    if (yield cancelled()) {
      yield put(cancelAction());
      cancel();
    }
  }
}
