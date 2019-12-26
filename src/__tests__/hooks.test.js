import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';

import { useInjectReducer } from '../hooks';

reactRedux.useStore = jest.fn().mockImplementation(() => ({
  injectedReducers: {}
}));

test('should clean up side effect', () => {
  const { rerender, unmount } = renderHook(({ key, reducer }) => {
    useInjectReducer(key, reducer);
  });
  rerender({ key: 'a' });
  rerender({ key: 'b' });
});
