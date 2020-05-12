/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs, { Dayjs } from 'dayjs';

import { inBrowser } from '../env';

import { paddingLeftZero } from './number';

export const now: () => number = inBrowser
  ? () => window.performance.now()
  : () => Date.now();

export type Dateable = string | number | Dayjs | undefined;

export function getYesterdayDateStr() {
  return dayjs()
    .subtract(1, 'day')
    .format('YYYY-MM-DD');
}

export function getTodayDateStr() {
  return dayjs().format('YYYY-MM-DD');
}

export function getLastWeekDateStrList() {
  const dateStrList = [];

  for (let i = 7; i > 0; i--) {
    dateStrList.push(
      dayjs()
        .subtract(i, 'day')
        .format('YYYY-MM-DD'),
    );
  }

  return dateStrList;
}

export function formatDatetimeWithoutYear(m: Dateable) {
  if (!m) {
    return '-';
  }

  return dayjs(m).format('MM-DD HH:mm:sss');
}

/** 格式化为标准时间形式 */
export function formatDate(m: Dateable) {
  if (!m || !dayjs(m).isValid()) {
    return '-';
  }
  return dayjs(m).format('YYYY-MM-DD');
}

/** 格式化为标准时间形式 */
export function formatDatetime(m: Dateable) {
  if (!m || !dayjs(m).isValid()) {
    return '-';
  }
  return dayjs(m).format('YYYY-MM-DD HH:mm:ss');
}

/** 简略些时间格式 */
export function formatDatetimeAsShort(m: Dateable) {
  if (!m) {
    return '-';
  }

  return dayjs(m).format('MM/DD HH:mm');
}

export function formatTime(m: Dateable) {
  if (!m) {
    return '-';
  }

  return dayjs(m).format('HH:mm');
}

/**
 * @start Formatter
 */

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = MILLISECONDS_SECOND * 60;
const MILLISECONDS_HOUR = MILLISECONDS_MINUTE * 60;
const MILLISECONDS_DAY = MILLISECONDS_HOUR * 24;

/**
 * 将某个时间差格式化展示为字符串
 */
export function formatDuration(
  // 这里的 duration 指的是毫秒
  duration: number,
  { len = 3, strip = false }: { len?: number; strip?: boolean } = {},
): string {
  if (!duration) {
    return '-';
  }

  let str = '';

  let usedBit = 0;

  const days = Math.floor(duration / MILLISECONDS_DAY);
  const hours = Math.floor((duration % MILLISECONDS_DAY) / MILLISECONDS_HOUR);
  const minutes = Math.floor(
    (duration % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE,
  );
  const seconds = Math.floor(
    (duration % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND,
  );

  let du, hu, mu, su;

  if (navigator.language.indexOf('zh') > -1) {
    du = '天';
    hu = '时';
    mu = '分';
    su = '秒';
  } else {
    du = 'd';
    hu = 'h';
    mu = 'm';
    su = 's';
  }

  if (days !== 0 && usedBit < len) {
    str = `${days}${du}`;
    usedBit++;
  }

  if (hours !== 0 && usedBit < len) {
    str = `${str} ${hours}${hu}`;
    usedBit++;
  }

  if (minutes !== 0 && usedBit < len) {
    str = `${str} ${minutes}${mu}`;
    usedBit++;
  }

  if (seconds !== 0 && usedBit < len) {
    str = `${str} ${seconds}${su}`;
  }

  return strip ? str.replace(' ', '') : str;
}

/**
 * 获取两个日期间的 Duration
 * @param m1 日期较小值
 * @param m2 日期较大值
 * @param len number 可选参数，保留时间描述位数
 * @param strip boolean 可选参数，剩余时间
 */

export function formatDurationWithRange(
  m1: Dateable,
  m2: Dateable,
  options: { len?: number; strip?: boolean } = {},
): string {
  if (!m1 || !m2) {
    return '-';
  }

  return formatDuration(dayjs(m2).valueOf() - dayjs(m1).valueOf(), options);
}

/**
 * 格式为数字时钟
 * @param duration
 */
export function formatDurationAsDigitalClock(
  // 这里的 duration 指的是毫秒
  duration: number,
): string {
  const hours = Math.floor(duration / MILLISECONDS_HOUR) || 0;
  const minutes =
    Math.floor((duration % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE) || 0;
  const seconds =
    Math.floor((duration % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND) || 0;

  return `${paddingLeftZero(hours)}:${paddingLeftZero(
    minutes,
  )}:${paddingLeftZero(seconds)}`;
}

/**
 * @end Formatter
 */
