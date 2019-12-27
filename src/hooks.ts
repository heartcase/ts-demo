import { useEffect } from 'react';
import { useStore, useSelector, useDispatch } from 'react-redux';
import { injectReducer } from './store';
import { EnhancedStore, Reducer, StateValue, Selector, NameSpace, AnyAction, ActionCreator } from './types/store';

export const useInjectReducer = (key: string, reducer: Reducer): void => {
  const store = useStore() as EnhancedStore;
  useEffect(() => {
    injectReducer(store, key, reducer);
  }, [key]);
};

export const useAdvancedSelector = (selectors: Record<string, Record<string, Selector>>): Function => {
  return (key: string, selector: string): StateValue => useSelector(selectors[key][selector || 'get']);
};

// Dispatch Functions are wrapped by empty arrow function for used as event handler
export const useAdvancedDispatch = (actions: Record<string, Record<string, ActionCreator<AnyAction>>>): Function => {
  const _dispatch = useDispatch();
  return (key: string, action: string, ...args: Array<StateValue>): Function => (): AnyAction =>
    _dispatch(actions[key][action](...args));
};

export const useDispatchActions = (): Function => {
  const _dispatch = useDispatch();
  return (actionArray: Array<AnyAction>): Function => (): Array<AnyAction> => _dispatch(actionArray);
};

export const useRedux = ({
  actions,
  selectors
}: NameSpace): { dispatch: Function; select: Function; dispatchActions: Function } => {
  const dispatch = useAdvancedDispatch(actions);
  const dispatchActions = useDispatchActions();
  const select = useAdvancedSelector(selectors);
  return {
    dispatch,
    dispatchActions,
    select
  };
};
