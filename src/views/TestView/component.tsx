import * as React from 'react';
import { buildNameSpace } from '../../store';
import { StateRecipes } from '../../types/store';
import { useInjectReducer, useAdvancedSelector } from '../../hooks';
import { useDispatch } from 'react-redux';

const namespace = 'test';
const recipes: Array<StateRecipes> = [
  { key: 'firstName', initialValue: 'John' },
  { key: 'lastName', initialValue: 'Doe' }
];
const { reducer, actions, selectors } = buildNameSpace({ namespace, recipes });

export const Component: React.FunctionComponent = () => {
  useInjectReducer(namespace, reducer);
  const dispatch = useDispatch();
  const select = useAdvancedSelector(selectors);
  return (
    <>
      <div>Personal Info</div>
      <div>{`${select('firstName')}`}</div>
      <button
        onClick={(): void => {
          dispatch(actions.firstName.set('Jimmy'));
        }}
      >
        Set to Jimmy
      </button>
      <button
        onClick={(): void => {
          dispatch(actions.firstName.set('Jimmy'));
        }}
      >
        Reset
      </button>
    </>
  );
};
