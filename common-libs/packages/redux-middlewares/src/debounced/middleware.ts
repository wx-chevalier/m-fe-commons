import { FsaAction } from './constants';

const timers = {};

export function middleware(
  defaultWait = 300,
  {
    leading = false,
    trailing = true,
    ignoreKeys = [],
  }: {
    /**
     * @see _.leading
     */
    leading?: boolean;
    /**
     * @see _.trailing
     */
    trailing?: boolean;
    ignoreKeys?: string[];
  } = {}
) {
  // tslint:disable-next-line: no-any
  return () => (next: any) => (action: FsaAction) => {
    if (!action || !action.meta || !action.meta.debounce) {
      return next(action);
    }

    const { meta: { debounce = {}, key: metaKey = '' } = {}, type } = action;

    const {
      time = defaultWait,
      key = type,
      // cancel 用于指示该 Action 是否用于取消计数器
      cancel = false,
    } = debounce;

    const shouldDebounce = ((time && key) || (cancel && key)) && (trailing || leading);
    const dispatchNow = leading && !timers[key];

    const later = (resolve: Function) => () => {
      if (trailing && !dispatchNow) {
        resolve(next(action));
      }
      timers[key] = null;
    };

    // 如果是需要忽略的键，则直接忽略
    if (ignoreKeys.indexOf(metaKey) > -1 || !shouldDebounce) {
      return next(action);
    }

    if (timers[key]) {
      clearTimeout(timers[key]);
      timers[key] = null;
    }

    if (!cancel) {
      return new Promise((resolve) => {
        if (dispatchNow) {
          resolve(next(action));
        }
        timers[key] = setTimeout(later(resolve), time);
      });
    }
  };
}

middleware._timers = timers;
