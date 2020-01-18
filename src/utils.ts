import { SafeCall } from './types';

export const safeCall: SafeCall = (fn, ...args) => fn && fn(...args);
