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

// 获得环比保留两位小数的百分比如12.23
export function getCircleCompare(preview: number, current: number) {
  const prev = accMul(preview, 1);
  const curr = accMul(current, 1);

  if (prev > curr) {
    return accDiv(
      Math.round(accMul(accDiv(accSub(prev, curr), Math.abs(prev)), 10000)),
      100,
    );
  } else if (prev < curr) {
    if (prev == 0) {
      return Number.POSITIVE_INFINITY;
    }
    return accDiv(
      Math.round(accMul(accDiv(accSub(curr, prev), Math.abs(prev)), 10000)),
      100,
    );
  } else {
    return 0;
  }
}

export function getCorrectResult(
  type: string,
  num1: number,
  num2: number,
  result: number,
) {
  let tempResult = 0;
  switch (type) {
    case 'add':
      tempResult = num1 + num2;
      break;
    case 'sub':
      tempResult = num1 - num2;
      break;
    case 'div':
      tempResult = num1 / num2;
      break;
    case 'mul':
      tempResult = num1 * num2;
      break;
  }
  if (Math.abs(result - tempResult) > 1) {
    return tempResult;
  }
  return result;
}

export function convertToInt(num: number | string) {
  num = Number(num);
  let newNum = num;
  const times = countDecimals(num);
  const tempNum = num.toString().toUpperCase();

  if (tempNum.split('E').length === 2) {
    newNum = Math.round(num * Math.pow(10, times));
  } else {
    newNum = Number(tempNum.replace('.', ''));
  }
  return newNum;
}

export function countDecimals(num: number | string) {
  let len = 0;
  try {
    num = Number(num);
    let str = num.toString().toUpperCase();
    if (str.split('E').length === 2) {
      // scientific notation
      let isDecimal = false;
      if (str.split('.').length === 2) {
        str = str.split('.')[1];
        if (parseInt(str.split('E')[0]) !== 0) {
          isDecimal = true;
        }
      }
      const x = str.split('E');
      if (isDecimal) {
        len = x[0].length;
      }
      len -= parseInt(x[1]);
    } else if (str.split('.').length === 2) {
      // decimal
      if (parseInt(str.split('.')[1]) !== 0) {
        len = str.split('.')[1].length;
      }
    }
  } catch (e) {
    throw e;
  } finally {
    if (isNaN(len) || len < 0) {
      len = 0;
    }
    return len;
  }
}

// 加法防止 0.3 显示为 0.30000000000000004
export function accAdd(num1: number, num2: number) {
  num1 = Number(num1);
  num2 = Number(num2);
  let dec1;
  let dec2;

  try {
    dec1 = countDecimals(num1) + 1;
  } catch (e) {
    dec1 = 0;
  }
  try {
    dec2 = countDecimals(num2) + 1;
  } catch (e) {
    dec2 = 0;
  }
  const times = Math.pow(10, Math.max(dec1, dec2));
  // const result = (num1 * times + num2 * times) / times;
  const result = (accMul(num1, times) + accMul(num2, times)) / times;
  return getCorrectResult('add', num1, num2, result);
  // return result;
}

// 减法防止 0.3 显示为 0.30000000000000004
export function accSub(num1: number, num2: number) {
  num1 = Number(num1);
  num2 = Number(num2);
  let dec1;
  let dec2;

  try {
    dec1 = countDecimals(num1) + 1;
  } catch (e) {
    dec1 = 0;
  }
  try {
    dec2 = countDecimals(num2) + 1;
  } catch (e) {
    dec2 = 0;
  }
  const times = Math.pow(10, Math.max(dec1, dec2));
  const result = Number((accMul(num1, times) - accMul(num2, times)) / times);

  return getCorrectResult('sub', num1, num2, result);
}

// ÷法防止0.3显示为0.30000000000000004
export function accDiv(num1: number, num2: number) {
  num1 = Number(num1);
  num2 = Number(num2);

  let t1 = 0;
  let t2 = 0;

  try {
    t1 = countDecimals(num1);
  } catch (e) {}
  try {
    t2 = countDecimals(num2);
  } catch (e) {}

  const dec1 = convertToInt(num1);
  const dec2 = convertToInt(num2);

  const result = accMul(dec1 / dec2, Math.pow(10, t2 - t1));

  return getCorrectResult('div', num1, num2, result);
}

// 乘法防止0.3显示为0.30000000000000004
export function accMul(num1: number, num2: number) {
  num1 = Number(num1);
  num2 = Number(num2);
  let times = 0;
  const s1 = num1.toString();
  const s2 = num2.toString();

  try {
    times += countDecimals(s1);
  } catch (e) {}
  try {
    times += countDecimals(s2);
  } catch (e) {}

  const result = (convertToInt(s1) * convertToInt(s2)) / Math.pow(10, times);

  return getCorrectResult('mul', num1, num2, result);
}

/** 计算平均值 */
export const calcAverage = (array: Array<any>) =>
  toFixedNumber(array.reduce((a, b) => a + b, 0) / array.length, 4);

export const calcSum = (array: Array<any>) =>
  toFixedNumber(
    array.reduce((a, b) => a + b, 0),
    4,
  );
