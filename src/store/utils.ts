import { dropRight, last, get } from 'lodash';

import { CreateState, NestedActionCreatorMap, ActionCreator } from './types';
import { safeCall } from '../utils';

export const createState: CreateState = (path, value) =>
  path.length > 0
    ? createState(dropRight(path), {
        [last(path)]: value
      })
    : value;

export const createActionCreatorGetter = (actions: NestedActionCreatorMap) => (
  localPath: string,
  method: string
): ActionCreator => (...args: any) =>
  safeCall(get(actions, [localPath, `@${method}`], null), ...args);
