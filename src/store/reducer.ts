import { merge, get } from 'lodash';

import { Reducer, ReducerMap, LoadType } from './types';
import { createState } from './utils';

// Reducer Dictionary
// Action should start with an '@'
export const reducerMap: ReducerMap = {
  '@set': (_, action) => action.payload,
  '@increment': state => state + 1,
  '@decrement': state => state - 1,
  '@incrementBy': (state, action) => state + action.payload
};

// get path and method function from action type
const loadType: LoadType = type => {
  const path = type.split(/@/);
  const method = get(reducerMap, `@${path.pop()}`, null);
  return { path, method };
};

// Auto Resolve Action Type and Compose Action Sequence
export const dummyReducer: Reducer = (state, action) => {
  const { type, actions } = action;
  // handle complex actions recursively
  if (Array.isArray(actions)) {
    const newState = actions.reduce(
      (result, nextAction) => dummyReducer(result, nextAction),
      state
    );
    return merge({}, state, newState);
  }
  // handle simple actions
  const { path, method } = loadType(type);
  if (method) {
    const newState = createState(path[0].split('.'), method(state, action));
    return merge({}, state, newState);
  }
  return state;
};
