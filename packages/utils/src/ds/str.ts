import uuid from 'uuid-random';

import { isValidArray } from './validator';

export function genId() {
  return uuid();
}

export function genRandomKey() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// https://github.com/darkskyapp/string-hash/blob/master/index.js
export function hash(str: string) {
  let hash = 5381;
  let i = str.length;

  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
  return hash >>> 0;
}

export function parseJson(str: string, defaultValue: any = null) {
  try {
    return JSON.parse(str) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

/** 从路径中获取到文件名 */
export function getFileNameFromPath(str: string = '') {
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
export function ellipsis(str: string, maxLength = 10) {
  if (str.length <= maxLength) {
    return str;
  }

  return `${str.slice(0, maxLength)}...`;
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
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  return JSON.stringify(obj, getCircularReplacer());
}
