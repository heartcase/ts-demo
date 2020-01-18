export type Maybe<T = any> = T | null;
export type AnyFunction = (...args: any[]) => any;
export type SafeCall<F extends AnyFunction = AnyFunction> = (
  fn: F,
  ...args: Parameters<F>
) => any;
