import * as React from 'react';
import { AppProps } from './types/';

export const App = (props: AppProps) => {
  const { appName } = props;
  return <h1>{`App name: ${appName}`}</h1>;
};

export default App;
