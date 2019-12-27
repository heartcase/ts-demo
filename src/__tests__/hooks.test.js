import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';
import { useRedux, useInjectReducer, useAdvancedSelector, useDispatchActions, useAdvancedDispatch } from '../hooks';

reactRedux.useStore = jest.fn().mockImplementation(() => ({
  injectedReducers: {},
  replaceReducer: jest.fn()
}));

test('should clean up side effect', () => {
  const { rerender } = renderHook(({ key, reducer }) => {
    useInjectReducer(key, reducer);
  });
  rerender({ key: 'a', reducer: state => state });
  rerender({ key: 'b', reducer: state => state });
});

const mockState = {
  a: 1
};

reactRedux.useSelector = jest.fn().mockImplementation(f => f(mockState));

test('test useAdvancedSelector', () => {
  const { result } = renderHook(() => {
    return useAdvancedSelector({
      a: {
        get: state => state.a
      }
    });
  });
  expect(result.current('a')).toEqual(1);
});

reactRedux.useDispatch = jest.fn().mockImplementation(() => s => s);

test('test useAdvancedDispatch', () => {
  const { result } = renderHook(() => {
    return useAdvancedDispatch({
      a: {
        set: value => ({ type: `a.set`, value })
      }
    });
  });

  expect(result.current('a', 'set', 2)()).toEqual({ type: `a.set`, value: 2 });
  expect(reactRedux.useDispatch).toHaveBeenCalled();
});

reactRedux.useDispatch = jest.fn().mockImplementation(() => s => s);

test('test useDispatchActions', () => {
  const { result } = renderHook(() => {
    return useDispatchActions();
  });

  expect(result.current([{ type: 'a' }])()).toEqual([{ type: `a` }]);
  expect(reactRedux.useDispatch).toHaveBeenCalled();
});

test('test useRedux', () => {
  const { result } = renderHook(() => {
    return useRedux({
      actions: {
        a: {
          set: value => ({ type: `a.set`, value })
        }
      },
      selectors: {
        a: {
          get: state => state.a
        }
      }
    });
  });
});
