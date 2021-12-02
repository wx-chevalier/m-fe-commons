/** Removes all undefined and nulls from the nested types making all nested fields
 * non-nullable hence you can simply chain through it and autosuggestion will work
 * and will not complain on undefiness and nullability of some of the nested fields
 * including the root
 *
 * @example
 * type AllOpt = {
 *  a?: string
 *  arr?: string[] | null
 *  b?: {
 *    c?: string | undefined | null
 *    n?:
 *      | {
 *          a?: string | null
 *          b: object | null
 *        }
 *      | null
 *      | undefined
 *  }
 *  c?: string
 * }
 *
 * type AllReq = RequireRecursively<AllOpt | undefined | null>
 *
 * const obj: AllReq = ({} as unknown) as AllReq
 *
 *  obj.b.c // -> string
 *  obj.b.n.a // -> string
 *  obj.b.n.b // -> object
 *  obj.arr // -> string[]
 *
 *
 */
export type RequiredRecursively<T> = Exclude<
  T extends string | number | boolean
    ? T
    : {
        [P in keyof T]-?: T[P] extends (infer U)[]
          ? RequiredRecursively<U>[]
          : T[P] extends Array<infer U>
          ? RequiredRecursively<U>[]
          : RequiredRecursively<T[P]>;
      },
  null | undefined
>;

export type AccessorFunction<T, R> = (object: RequiredRecursively<T>) => R;

export function get<T, R>(
  object: T,
  accessorFn: AccessorFunction<T, R>,
): R | undefined;
export function get<T, R>(
  object: T,
  accessorFn: AccessorFunction<T, R>,
  defaultValue: R,
): R;
export function get<T, R>(
  object: T,
  accessorFn: AccessorFunction<T, R>,
  defaultValue?: R,
): R | undefined {
  try {
    const result = accessorFn((object as unknown) as RequiredRecursively<T>);
    return result === undefined || result === null ? defaultValue : result;
  } catch (e) {
    return defaultValue;
  }
}

export function getString<T>(
  object: T,
  accessorFn: AccessorFunction<T, string>,
): string | undefined;
export function getString<T>(
  object: T,
  accessorFn: AccessorFunction<T, string>,
  defaultValue: string,
): string;
export function getString<T>(
  object: T,
  accessorFn: AccessorFunction<T, string>,
  defaultValue?: string,
): string | undefined {
  try {
    const result = get(object, accessorFn, defaultValue);

    if (typeof result !== 'string') {
      return JSON.stringify(result);
    }

    return result;
  } catch (e) {
    // 强提示
    console.error('>>>getString>>>', e);
    return defaultValue;
  }
}
