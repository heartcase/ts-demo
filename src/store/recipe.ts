import { mapValues, get, merge } from 'lodash';

import {
  StateRecipe,
  ActionCreatorMap,
  ActionCreator,
  StateBundle,
  NamespaceBundle
} from './types';
import { reducerMap } from './reducer';
import { createState } from './utils';

// Load State Info from Recipe Object
export const createStateBundle = ({
  path,
  initialValue,
  otherProps
}: StateRecipe): StateBundle => {
  const actions: ActionCreatorMap = mapValues(
    reducerMap,
    (_, method): ActionCreator => payload => ({
      type: `${path}${method}`,
      payload
    })
  );

  actions['@reset'] = () => ({
    type: `${path}@reset`,
    actions: [actions['@set'](initialValue)]
  });
  actions['@request'] = (request, callbacks, mode, id) => {
    return {
      type: `${path}@request`,
      payload: {
        request: merge({}, get(otherProps, 'request', {}), request),
        callbacks: merge(
          {},
          {
            successAction: get(otherProps, 'callbacks.successAction', null),
            errorAction: get(otherProps, 'callbacks.errorAction', null),
            cancelAction: get(otherProps, 'callbacks.cancelAction', null),
            onRequestAction: get(otherProps, 'callbacks.onRequestAction', null)
          },
          callbacks
        ),
        mode: mode || get(otherProps, 'mode', 'takeEvery'),
        path,
        id
      }
    };
  };

  const preloadedState = createState(path.split('.'), initialValue);
  return { path, actions, preloadedState };
};

// Create a namespace state from a list of stateRecipe
export const createNamespaceBundle = (
  namespace: string,
  recipes: StateRecipe[],
  otherProps?: any
): NamespaceBundle => {
  const stateBundles = recipes.map(recipe =>
    createStateBundle({
      ...recipe,
      path: `${namespace}.${recipe.path}`
    })
  );

  const actions = merge(
    {},
    ...stateBundles.map(
      bundle => createState(bundle.path.split('.'), bundle.actions)[namespace]
    )
  );

  const preloadedState = {
    [namespace]: merge(
      {},
      ...stateBundles.map(bundle => bundle.preloadedState[namespace])
    )
  };

  actions['@reset'] = () => ({
    type: `${namespace}@reset`,
    actions: [actions['@set'](preloadedState)]
  });
  (actions['@request'] as ActionCreator) = (request, callbacks, mode) => {
    return {
      type: `${namespace}@request`,
      payload: {
        request: merge({}, get(otherProps, 'request', {}), request),
        callbacks: merge(
          {},
          {
            successAction: get(otherProps, 'callbacks.successAction', null),
            errorAction: get(otherProps, 'callbacks.errorAction', null),
            cancelAction: get(otherProps, 'callbacks.cancelAction', null)
          },
          callbacks
        ),
        mode: mode || get(otherProps, 'mode', 'takeEvery'),
        path: namespace
      }
    };
  };

  return {
    path: namespace,
    actions,
    preloadedState
  };
};
