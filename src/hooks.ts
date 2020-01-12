import { useEffect } from 'react';
import { useStore, useSelector, useDispatch } from 'react-redux';

import { injectReducer, injectSaga } from './store';
import { EnhancedStore, Reducer, Selector, ActionCreator, ReduxPath, Action } from './types/store';
import { request } from './sagas';

export const useInjectReducer = (namespace: string, reducer: Reducer) => {
  const store = useStore() as EnhancedStore;
  useEffect(() => {
    if (!store.injectedReducers[namespace]) {
      injectReducer(store, namespace, reducer);
    }
  }, [namespace]);
};

export const useAdvancedSelector = (selectors: ReduxPath<Selector>) => {
  return (key: string, selector = 'get') => useSelector(selectors[key][selector]);
};

// Dispatch Functions are wrapped by empty arrow function for used as event handler
export const useAdvancedDispatch = (actions: ReduxPath<ActionCreator>) => {
  const dispatch = useDispatch();
  const store = useStore() as EnhancedStore;
  return (key: string, type: string, ...args: any[]) => () => {
    const action = actions[key][type](...args);
    if (action.type === '__request__') {
      const task = store.runSaga(request, action);
      injectSaga(store, action.statePath.split('.')[0], task, action.statePath, action.mode);
    }
    return dispatch(action);
  };
};

export const useDispatchActions = () => {
  const dispatch = useDispatch();
  return (actionArray: Array<Action> | Action) => () => dispatch(actionArray);
};

export const useRedux = ({
  actions,
  selectors
}: {
  actions: ReduxPath<ActionCreator>;
  selectors: ReduxPath<Selector>;
}) => {
  const dispatch = useAdvancedDispatch(actions);
  const dispatchActions = useDispatchActions();
  const select = useAdvancedSelector(selectors);
  return {
    dispatch,
    dispatchActions,
    select
  };
};
