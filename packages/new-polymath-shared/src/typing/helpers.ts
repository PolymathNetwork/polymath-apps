export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never;
export type SecondArgumentType<T> = T extends (arg1: any, arg2: infer A) => any
  ? A
  : never;
export type FilterPropNamesByType<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K
}[keyof T];
