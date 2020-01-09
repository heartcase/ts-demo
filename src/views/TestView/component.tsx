import * as React from 'react';
import { buildNameSpace, requestAction } from '../../store';
import { StateRecipes, AnyAction } from '../../types/store';
import { useRedux, useInjectReducer } from '../../hooks';

// Namespace States Declaration
const namespace = 'test';
const recipes: Array<StateRecipes> = [
  { key: 'firstName', initialValue: 'John' },
  { key: 'lastName', initialValue: 'Doe' },
  {
    key: 'fullName',
    initialValue: 'John Doe',
    actions: requestAction,
    otherProps: {
      request: { method: 'get', url: 'api/user/12345/fullname' } // default axios request config
    }
  }
];

// Push the limits, every state took about 461B in memory
for (let i = 0; i < 100000; i++) {
  recipes.push({ key: `personId${i}`, initialValue: `The ${i}` });
}

// Build Namespace Data
const namespaceData = buildNameSpace({ namespace, recipes });
const { reducer, actions, resetNamespace } = namespaceData;

// Build Action Sequence
const setName = (firstName: string, lastName: string): Array<AnyAction> => {
  const actionArray = [actions.firstName.set(firstName), actions.lastName.set(lastName)];
  actionArray.toString = (): string => `setName(${firstName}, ${lastName})`;
  return actionArray;
};

// The View Component
// A Combination of Container and Layout
export const Component: React.FunctionComponent = () => {
  // Local Hooks
  useInjectReducer(namespace, reducer);
  const { dispatch, select, dispatchActions } = useRedux(namespaceData);
  // Possible to access another namespace by importing their namespace accessor
  // import { accessor } from 'some/other/views'
  // const {
  //   dispatch: otherDispatch,
  //   select: otherSelect,
  //   dispatchActions: otherDispatchActions
  // } = useRedux(accessor.namespace, accessor.namespaceData);
  return (
    <>
      <div>Personal Info</div>
      {/* Example of using selector */}
      <div>{`${select('firstName')} ${select('lastName')}`}</div>
      <div>{`${select('fullName')}`}</div>

      {/* Example of dispatch simple single action */}
      <button onClick={dispatch('firstName', 'set', 'Jimmy')}>Set to Jimmy</button>

      {/* Example of dispatch a request */}
      <button
        onClick={dispatch(
          'fullName',
          'request',
          {
            parmas: {
              id: 1588
            }
          }, // axios request config
          actions.fullName.set('Loading'), // preRequest Action
          actions.firstName.set, // Success Callback
          actions.fullName.set // Failure Callback
        )}
      >
        Fetch Full Name
      </button>

      {/* Example of dispatch action sequence  */}
      <button onClick={dispatchActions(setName('Jimmy', 'Green'))}>Set both names</button>

      {/* Example of dispatch default cleanup actions */}
      <button onClick={dispatchActions(resetNamespace)}>Reset</button>
    </>
  );
};

// Export external accessor for other namespace
export const accessor = {
  namespace,
  namespaceData
};
