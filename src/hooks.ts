import { useEffect } from 'react';
import { useStore, useSelector, useDispatch } from 'react-redux';
import { injectReducer } from './store';
import { EnhancedStore, Reducer, Selector, ActionCreator, ReduxPath, Action } from './types/store';

export const useInjectReducer = (key: string, reducer: Reducer) => {
  const store = useStore() as EnhancedStore;
  useEffect(() => {
    injectReducer(store, key, reducer);
  }, [key]);
};

export const useAdvancedSelector = (selectors: ReduxPath<Selector>) => {
  return (key: string, selector = 'get') => useSelector(selectors[key][selector]);
};

// Dispatch Functions are wrapped by empty arrow function for used as event handler
export const useAdvancedDispatch = (actions: ReduxPath<ActionCreator>) => {
  const dispatch = useDispatch();
  return (key: string, type: string, ...args: any[]) => () => dispatch(actions[key][type](...args));
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
