import * as React from 'react';
import { ComponentType } from 'react';
import loadable from 'loadable-components';

const TestComponent: React.FunctionComponent = ({ params }: any) => <>{params.okay}</>;
const TestView = loadable(() => import('./views/TestView/component'));

export const router: {
  [path: string]: ComponentType<any>;
} = {
  '/test/:okay': TestComponent,
  '/test': TestView
};
