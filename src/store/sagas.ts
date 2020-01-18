import { Canceler } from 'axios';
import { merge } from 'lodash';
import { put, cancelled } from 'redux-saga/effects';
import axios from 'axios';

import { Action, RequestActionPayload, RequestResponse } from './types';
import { Maybe } from '../types';
import { safeCall } from '../utils';

// handle data fetching
export function* request(action: Action<RequestActionPayload>) {
  let cancel: Maybe<Canceler> = null;
  const {
    request,
    path,
    callbacks: { successAction, errorAction, cancelAction, onRequestAction }
  } = action.payload;
  // if task canceled, cancel will become a canceler function
  request.cancelToken = new axios.CancelToken(canceler => {
    cancel = canceler;
  });
  try {
    yield put(onRequestAction);
    const response: RequestResponse = yield axios(request);
    const { data } = response;
    yield put({ type: `${path}@set`, payload: data });
    yield put(merge({}, successAction, { payload: data }));
  } catch (error) {
    yield put(merge({}, errorAction, { payload: error }));
  } finally {
    if (yield cancelled()) {
      safeCall(cancel);
      yield put(cancelAction);
    }
  }
}
