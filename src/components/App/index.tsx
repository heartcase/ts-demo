import * as React from 'react';
import { Route, useRouteMatch, Link } from 'react-router-dom';
import { get } from 'lodash';

import { FunctionComponent } from './types/';
import { router } from '../../router';

export const App: FunctionComponent = () => {
  const match = useRouteMatch(Object.keys(router));
  const path: string = get(match, 'path', '');
  const params: object = get(match, 'params', {});
  const Component: React.ComponentType<any> = get(router, path, null);
  console.log(Component);
  return (
    <>
      <nav>
        <Link to="/test">TestView</Link>
        <Link to="/test/a">Link A</Link>
        <Link to="/test/b">Link B</Link>
        <Link to="/no/such/path">Link C</Link>
      </nav>
      <Route path={path}>{Component && <Component params={params} />}</Route>
    </>
  );
};

export default App;
