import * as React from 'react';

import { StateRecipe, Action } from '../../store/types';
import { createNamespaceBundle } from '../../store/recipe';
import {
  useAdvancedDispatch,
  useAdvancedSelector,
  useInjectState
} from '../../hooks';
import { createActionCreatorGetter } from '../../store/utils';

// Namespace States Declaration
const namespace = 'test';
const recipes: Array<StateRecipe> = [
  { path: 'firstName', initialValue: 'John' },
  { path: 'lastName', initialValue: 'Doe' },
  {
    path: 'fullName',
    initialValue: 'John Doe',
    otherProps: {
      request: { method: 'get', url: 'api/user/12345/fullname' }, // default axios request config
      mode: 'takeLast', // asynchronous action mode
      callbacks: {
        onRequestAction: { type: 'test.fullName@set', payload: 'Loading' }
      }
    }
  },
  { path: 'a', initialValue: {} },
  { path: 'a.sampleList', initialValue: [] },
  { path: 'a.sampleList2', initialValue: [] }
];

// Build Namespace Data
const namespaceData = createNamespaceBundle(namespace, recipes);
const { actions, preloadedState } = namespaceData;
const getActionCreator = createActionCreatorGetter(actions);

// Build Event
const setBothName = (firstName: string, lastName: string): Action => {
  return {
    type: `${namespace}@setFullName`,
    actions: [
      getActionCreator('firstName', 'set')(firstName),
      getActionCreator('lastName', 'set')(lastName)
    ]
  };
};

// The View Component
// A Combination of Container and Layout
export const Component: React.FunctionComponent = () => {
  // Local Hooks
  useInjectState(namespace, preloadedState);
  const dispatch = useAdvancedDispatch(actions);
  const select = useAdvancedSelector(namespace);
  return (
    <>
      <div>Personal Info</div>
      {/* Example of using selector */}
      <div>{`${select('firstName')} ${select('lastName')}`}</div>
      <div>{`${select('fullName')}`}</div>
      <div>
        <button onClick={dispatch('firstName', 'set', 'Harry')}>
          Set firstName to Harry
        </button>
        <button onClick={dispatch(setBothName('Harry', 'Potter'))}>
          Set name to Harry Potter
        </button>
        <button
          onClick={dispatch(
            'fullName',
            'request',
            {},
            {
              successAction: getActionCreator('firstName', 'set')(),
              errorAction: getActionCreator('firstName', 'set')(),
              cancelAction: getActionCreator('firstName', 'set')()
            }
          )}
        >
          Request fullName
        </button>
      </div>
    </>
  );
};

// Export external accessor for other namespace
export const accessor = {
  namespace,
  namespaceData,
  getActionCreator
};

export default Component;
