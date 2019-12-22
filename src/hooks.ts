import { useEffect } from 'react';
import { useStore, useSelector } from 'react-redux';
import { injectReducer } from './store';
import { InjectedStore, Reducer, StateValue, Selector } from './types/store';

export const useInjectReducer = (key: string, reducer: Reducer): void => {
  const store = useStore() as InjectedStore;
  useEffect(() => {
    injectReducer(store, key, reducer);
  }, [key]);
};

export const useAdvancedSelector = (selectors: Record<string, Record<string, Selector>>): Function => {
  return (key: string, selector: string): StateValue => useSelector(selectors[key][selector || 'get']);
};
