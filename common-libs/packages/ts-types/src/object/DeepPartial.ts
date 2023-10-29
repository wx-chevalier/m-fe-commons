/**
 * Make a type and all its (sub) properties optional.
 */
export type DeepPartial<T> = T extends any[]
  ? DeepPartialArray<T[number]>
  : T extends object
  ? DeepPartialObject<T>
  : T;

/* eslint-disable @typescript-eslint/no-empty-interface */
interface DeepPartialArray<T> extends Array<DeepPartial<T>> {}

type DeepPartialObject<T> = {
  [P in keyof T]+?: DeepPartial<T[P]>;
};
