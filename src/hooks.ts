import { useEffect, Dispatch } from 'react';
import { get } from 'lodash';
import { useStore, useSelector, useDispatch } from 'react-redux';

import { EnhancedStore, Action, NestedActionCreatorMap } from './store/types';
import { safeCall } from './utils';
import { selectorMap } from './store/selectors';

export const useInjectState = (namespace: string, state: any) => {
  const store = useStore() as EnhancedStore;
  useEffect(() => {
    store.injectState(namespace, state);
  }, [namespace]);
};

export const useAdvancedSelector = (namespace: string) => {
  return (localPath: string, selector = '$get') => {
    return useSelector(state => {
      return selectorMap[selector](
        get(state, `${namespace}.${localPath}`, undefined)
      );
    });
  };
};

// Dispatch Functions are wrapped by empty arrow function for used as event handler
export const useAdvancedDispatch = (
  actions: NestedActionCreatorMap
): ((
  localPath: string | Action,
  method?: string,
  ...args: any[]
) => Dispatch<Action>) => {
  const dispatch = useDispatch();
  return (localPath, method, ...args) => () => {
    if (typeof localPath !== 'string') {
      return dispatch(localPath);
    }
    const action = safeCall(
      get(actions, [localPath, `@${method}`], null),
      ...args
    );
    if (action) return dispatch(action);
    console.warn(
      `Action ${localPath}@${method} is not found, check your state path or method name`
    );
  };
};
