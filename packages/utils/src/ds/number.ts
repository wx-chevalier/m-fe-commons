/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(
  min = 0,
  max = 100,
  floatLength = 2,
): number {
  return Number((Math.random() * (max - min) + min).toFixed(floatLength));
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min = 0, max = 100) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 格式化显示体积 */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/** 格式化百分比 */
export function formatPercent(percent: number) {
  return `${(percent * 100).toFixed(2)}%`;
}

// 左侧补全
export function paddingLeftZero(num: number) {
  if (num > 9) {
    return `${num}`;
  }

  return `0${num}`;
}

// 转化为固定格式的数字
export function toFixedNumber(
  num: number | string,
  fractionDigits = 2,
  useEvenRound = true,
) {
  // 默认使用银行家算法
  if (useEvenRound) {
    const d = fractionDigits || 2;
    const m = Math.pow(10, d);
    const n = +(d ? Number(num) * m : Number(num)).toFixed(8);
    const i = Math.floor(n),
      f = n - i;
    const e = 1e-8;
    const r =
      f > 0.5 - e && f < 0.5 + e ? (i % 2 == 0 ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
  }

  return parseFloat(Number(num).toFixed(fractionDigits));
}
