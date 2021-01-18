/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isMoment from 'dayjs/plugin/isMoment';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import timeZone from 'dayjs-ext/plugin/timeZone';

export * from './antd-dayjs';

dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(isMoment);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localeData);
dayjs.extend(relativeTime);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(timeZone);
dayjs.extend(weekday);

try {
  if (!Array.prototype.flat) {
    Object.defineProperty(Array.prototype, 'flat', {
      configurable: true,
      value: function flat() {
        const depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);

        return depth
          ? Array.prototype.reduce.call(
              this,
              function (acc: any, cur: any) {
                if (Array.isArray(cur)) {
                  acc.push.apply(acc, (flat.call as any)(cur, depth - 1));
                } else {
                  acc.push(cur);
                }

                return acc;
              },
              []
            )
          : Array.prototype.slice.call(this);
      },
      writable: true,
    });
  }
} catch (_) {
  console.error(_);
}
