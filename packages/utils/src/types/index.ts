export const ifExist = <T>(
  toCheck: T | null | undefined,
  truthyValue: T = toCheck,
  fallback?: T,
) => (toCheck ? truthyValue : ((fallback || '') as T));

export type DeepPartial<T> = {
  [key in keyof T]?: DeepPartial<T[key]>;
};

export type Type<T> = new (...args: unknown[]) => T;

export type StyleObject = Record<string, string | number>;

export * from './BaseEntity';
export * from './BaseService';
export * from './basic';
