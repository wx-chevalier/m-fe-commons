import uuid from 'uuid-random';

export function genId() {
  return uuid();
}

// https://github.com/darkskyapp/string-hash/blob/master/index.js
export function hash(str: string) {
  let hash = 5381;
  let i = str.length;

  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
  return hash >>> 0;
}

export function parseJson(str: string, defaultValue = {}) {
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
