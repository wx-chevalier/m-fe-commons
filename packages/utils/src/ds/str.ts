import uuid from 'uuid-random';

import { isValidArray } from './validator';

/** UUID */
export function genId() {
  return uuid();
}

/** 随机 xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx 键 */
export function genRandomKey() {
  return 'xxxxxxxx-xxxx-9xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 生成随机字符串
 * @param len 字符串长度 默认值：32
 */
export const randomString = (len = 32) => {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let res = '';
  for (let i = 0; i < len; i++) {
    res += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return res;
};

// https://github.com/darkskyapp/string-hash/blob/master/index.js
export function hash(str: string) {
  let hash = 5381;
  let i = str.length;

  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
  return hash >>> 0;
}

/** 解析 JSON */
export function parseJson(str: string, defaultValue: any = null) {
  try {
    const parsedValue = JSON.parse(str);

    if (parsedValue === undefined || parsedValue === null) {
      return defaultValue;
    }

    return parsedValue;
  } catch (e) {
    return defaultValue;
  }
}

/** 从路径中获取到文件名 */
export function getFileNameFromPath(str = '') {
  return str.split(/(\\|\/)/g).pop();
}

export function searchWithTextTransform(targetStr = '', featStr = '') {
  return `${targetStr.toLowerCase()}`.indexOf(featStr.toLowerCase()) > -1;
}

/** 判断是否包含中文 */
export function hasChinese(str: string) {
  const REGEX_CHINESE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
  const hasChinese = str.match(REGEX_CHINESE);

  return hasChinese;
}

/** 进行字符串截断 */
export function ellipsis(str = '', maxLength = 10) {
  if (str.length <= maxLength) {
    return str;
  }

  return `${str.slice(0, maxLength)}...`;
}

/** 进行字符串 Mask */
export function maskStr(str: string, minIndex = 0, maxIndex = 10, mask = '*') {
  let res = '';

  for (let i = 0; i < str.length; i++) {
    if (i >= minIndex && i <= maxIndex) {
      res += mask;
    } else {
      res += str[i];
    }
  }

  return res;
}

/** 根据字符串进行排序 */
export function sortByName(n1: string, n2: string) {
  // 首先判断有数字
  const p1n = n1.match(/\d+/g);
  const p2n = n2.match(/\d+/g);

  if (isValidArray(p1n) && isValidArray(p2n)) {
    return Number(p1n[0]) - Number(p2n[0]);
  }

  return n1 > n2 ? 1 : -1;
}

/** 在递归调用场景下序列化 */
export function stringifyWithCircularRef(obj: any) {
  const getCircularReplacer = () => {
    const seen = new WeakSet();

    return (_key: any, value: any) => {
      try {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }

        return value;
      } catch (_) {
        return value;
      }
    };
  };

  return JSON.stringify(obj, getCircularReplacer());
}

export const stringify = stringifyWithCircularRef;

/** 替换全部 */

export function replaceAll(
  str: string,
  needle: string,
  replacement: string | Function,
  options: { fromIndex?: number; caseInsensitive?: boolean } = {},
) {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected input to be a string, got ${typeof str}`);
  }

  if (
    !(typeof needle === 'string' && needle.length > 0) ||
    !(typeof replacement === 'string' || typeof replacement === 'function')
  ) {
    return str;
  }

  let result = '';
  let matchCount = 0;
  let prevIndex = options.fromIndex > 0 ? options.fromIndex : 0;

  if (prevIndex > str.length) {
    return str;
  }

  while (true) {
    // eslint-disable-line no-constant-condition
    const index = options.caseInsensitive
      ? str.toLowerCase().indexOf(needle.toLowerCase(), prevIndex)
      : str.indexOf(needle, prevIndex);

    if (index === -1) {
      break;
    }

    matchCount++;

    const replaceStr =
      typeof replacement === 'string'
        ? replacement
        : replacement(
            // If `caseInsensitive`` is enabled, the matched substring may be different from the needle.
            str.slice(index, index + needle.length),
            matchCount,
            str,
            index,
          );

    // Get the initial part of the string on the first iteration.
    const beginSlice = matchCount === 1 ? 0 : prevIndex;

    result += str.slice(beginSlice, index) + replaceStr;

    prevIndex = index + needle.length;
  }

  if (matchCount === 0) {
    return str;
  }

  return result + str.slice(prevIndex);
}

/** 与编解码相关的操作 */
export function decodeUnicodeStr(str: string) {
  const r = /\\x([\d\w]{2,4})/gi;

  const x = str.replace(r, (match, grp) => {
    return String.fromCharCode(parseInt(grp, 16));
  });

  return x;
}

export function getStrByIndexAfterSplit(
  str: string,
  separator: string,
  index: number,
) {
  const splittedStrs = str.split(separator);

  return splittedStrs[index] || '';
}

/** 判断是否字符串是否模糊匹配一系列 */
export function fuzzyIncludes(str: string, targets: string[]) {
  return targets.reduce((prev, cur) => str.includes(cur) || prev, false);
}

/** 移除哪些可能导致问题的 */
export function escapeStringBugs(str: string) {
  // _ 用于区分支撑与实体
  // . 用于留存文件后缀名
  return str.replace(/[^a-zA-Z0-9\u4e00-\u9fa5.+-_#@=\(\)]/g, '');
}
