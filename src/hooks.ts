import { useEffect } from 'react';
import { useStore, useSelector, useDispatch } from 'react-redux';
import { injectReducer } from './store';
import { InjectedStore, Reducer, StateValue, Selector, NameSpace, AnyAction } from './types/store';

export const useInjectReducer = (key: string, reducer: Reducer): void => {
  const store = useStore() as InjectedStore;
  useEffect(() => {
    injectReducer(store, key, reducer);
  }, [key]);
};

export const useAdvancedSelector = (selectors: Record<string, Record<string, Selector>>): Function => {
  return (key: string, selector: string): StateValue => useSelector(selectors[key][selector || 'get']);
};

export const useRedux = (
  namespace: string,
  { reducer, actions, selectors }: NameSpace
): { dispatch: Function; select: Function; dispatchActions: Function } => {
  useInjectReducer(namespace, reducer);
  const _dispatch = useDispatch();
  const dispatch = (key: string, action: string, ...args: Array<StateValue>): AnyAction =>
    _dispatch(actions[key][action](...args));
  const dispatchActions = (actions: Array<AnyAction>): Array<AnyAction> => _dispatch(actions);
  const select = useAdvancedSelector(selectors);
  return {
    dispatch,
    dispatchActions,
    select
  };
};
