import { useEffect } from 'react';
import { useStore, useSelector, useDispatch } from 'react-redux';
import { injectReducer } from './store';
import { EnhancedStore, Reducer, StateValue, Selector, NameSpace, AnyAction } from './types/store';

export const useInjectReducer = (key: string, reducer: Reducer): void => {
  const store = useStore() as EnhancedStore;
  useEffect(() => {
    injectReducer(store, key, reducer);
  }, [key]);
};

export const useAdvancedSelector = (selectors: Record<string, Record<string, Selector>>): Function => {
  return (key: string, selector: string): StateValue => useSelector(selectors[key][selector || 'get']);
};

export const useRedux = (
  namespace: string,
  { actions, selectors }: NameSpace
): { dispatch: Function; select: Function; dispatchActions: Function } => {
  const _dispatch = useDispatch();
  const dispatch = (key: string, action: string, ...args: Array<StateValue>): Function => (): AnyAction =>
    _dispatch(actions[key][action](...args));
  const dispatchActions = (actions: Array<AnyAction>): Function => (): Array<AnyAction> => _dispatch(actions);
  const select = useAdvancedSelector(selectors);
  return {
    dispatch,
    dispatchActions,
    select
  };
};
