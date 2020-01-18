import { dropRight, last } from 'lodash';

import { CreateState } from './types';

export const createState: CreateState = (path, value) =>
  path.length > 0
    ? createState(dropRight(path), {
        [last(path)]: value
      })
    : value;
