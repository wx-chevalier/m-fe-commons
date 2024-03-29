import { isEmpty } from 'lodash-es';

import { isPrimitive } from './validator';

/**
 * 用于构造函数的分配函数
 * @param objThis 目标对象
 * @param data 待处理的数据
 */
export function assignInConstructor(objThis: object, data: object = {}) {
  for (const key of Object.keys(data)) {
    if (
      // 当前值为空，则使用传入值
      (objThis[key] === undefined ||
        // 如果是基础类型，则表示肯定是默认值
        isPrimitive(objThis[key]) ||
        // 如果为空，这里表示的是空数组或者空对象
        isEmpty(objThis[key]) ||
        // 或者是对象，但是不是类实例，则表示可能是默认值
        (typeof objThis[key] === 'object' &&
          objThis[key].constructor.name === 'Object')) &&
      data[key] !== undefined
    ) {
      objThis[key] = data[key];
    }
  }
}

/* eslint-disable @typescript-eslint/prefer-for-of */
/**
 * Convert a value to a string that is actually rendered.
 */
export function toString(val: any): string {
  return val == null
    ? ''
    : typeof val === 'object'
    ? JSON.stringify(val, null, 2)
    : String(val);
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber(val: string): number | string {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
export function makeMap(
  str: string,
  expectsLowerCase?: boolean,
): (key: string) => true | void {
  const map = Object.create(null);
  const list: Array<string> = str.split(',');
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
}

/**
 * Check if a tag is a built-in tag.
 */
export const isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
export const isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
export function remove(arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

/**
 * Check whether the object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: object | Array<any>, key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

/**
 * Create a cached version of a pure function.
 */
export const cached = (fn: Function) => {
  // 1
  const cache = {}; // 2
  return (...args: any[]) => {
    // 3
    const stringifiedArgs = JSON.stringify(args); // 4
    const result = (cache[stringifiedArgs] =
      cache[stringifiedArgs] || fn(...args)); // 5
    return result; // 6
  };
};
/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});

/**
 * Capitalize a string.
 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /([^-])([A-Z])/g;
export const hyphenate = cached((str: string): string => {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase();
});

/**
 * Simple bind, faster than native
 */
export function bind(fn: Function, ctx: object): Function {
  function boundFn(a: any) {
    const l: number = arguments.length;
    return l
      ? l > 1
        ? // eslint-disable-next-line prefer-rest-params
          fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx);
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn;
}

/**
 * Mix properties into target object.
 */
export function extend(to: object, _from?: object): object {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}

export function objectWithoutProperties<T, K extends keyof T>(
  obj: T,
  exclude: K[],
) {
  const target = {} as Pick<T, Exclude<keyof T, K>>;
  for (const k in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, k) &&
      // @ts-ignore
      exclude.indexOf(k) === -1
    ) {
      // @ts-ignore
      target[k] = obj[k];
    }
  }
  return target;
}

/**
 * Merge an Array of objects into a single object.
 */
export function toobject(arr: Array<any>): object {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}
