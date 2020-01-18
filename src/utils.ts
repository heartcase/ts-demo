import { SafeCall } from './types';

export const safeCall: SafeCall = (fn, ...args) =>
  typeof fn === 'function' && fn(...args);
