import * as React from 'react';
import { AppProps, FunctionComponent } from './types/';

export const App: FunctionComponent<AppProps> = (props: AppProps) => {
  const { appName } = props;
  return <h1>{`App name: ${appName}`}</h1>;
};

export default App;
