/* eslint-disable @typescript-eslint/prefer-for-of */
import { is, isObject } from './validator';

const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;

/**
 * 判断是否不等
 * @param a 参数一
 * @param b 参数二
 */
export function safeNotEqual(a: any, b: any) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

const hasOwn = Object.prototype.hasOwnProperty;

export const shallowEqual = (objA: any, objB: any) => {
  if (is(objA, objB)) return true;

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    // eslint-disable-line
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
};

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
export function looseEqual(a: any, b: any): boolean {
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (e) {
      // possible circular reference
      return a === b;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}

/**
 * Get index with looseEqual
 * @param arr
 * @param val
 */
export function looseIndexOf(arr: any[], val: any): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i;
  }
  return -1;
}

/**
 * Check if two values are loosely equal
 * @param a
 * @param b
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    const arrA = isArray(a);
    const arrB = isArray(b);
    let i: number;
    let length: number;
    let key: any;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }

    if (arrA != arrB) return false;

    const dateA = a instanceof Date,
      dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    const regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    const keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length) return false;

    for (i = length; i-- !== 0; ) if (!hasProp.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      key = keys[i];
      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return a !== a && b !== b;
}
