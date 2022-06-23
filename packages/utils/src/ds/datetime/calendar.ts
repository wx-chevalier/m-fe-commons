/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs, { Dayjs } from 'dayjs';

export function getYesterdayDateStr() {
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
}

export function getTodayDateStr() {
  return dayjs().format('YYYY-MM-DD');
}

/** 获取当前天所在周 */
export function getCurrentWeekDates(targetDay: Dayjs = dayjs()) {
  const dayInWeek = targetDay.day();
  const dates = [];

  let monday: Dayjs;

  if (dayInWeek === 0) {
    // 如果当天是周日，则向前推算七天
    monday = targetDay.subtract(6, 'day');
  } else {
    // 否则从当天向前推几天
    monday = targetDay.subtract(dayInWeek - 1, 'day');
  }

  for (let i = 0; i < 7; i++) {
    dates.push(monday.add(i, 'day'));
  }

  return dates;
}

/** 获取前一周的分布 */
export function getLastWeekDateStrList() {
  const dateStrList = [];

  for (let i = 7; i > 0; i--) {
    dateStrList.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }

  return dateStrList;
}

/** 获取某个时间范围 */
const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

/** 禁用过去的时间 */
export const disabledPassedTime = (date: Dayjs) => {
  const currentDate = dayjs().date();
  const currentMonth = dayjs().month();

  const selectedDate = dayjs(date).date();
  const selectedMonth = dayjs(date).month();

  if (
    selectedMonth > currentMonth ||
    (selectedMonth === currentMonth && selectedDate > currentDate)
  ) {
    return {
      disabledHours: () => range(0, 0),
      disabledMinutes: () => range(0, 0),
    };
  } else {
    return {
      disabledHours: () => range(0, dayjs().hour()),
    };
  }
};
