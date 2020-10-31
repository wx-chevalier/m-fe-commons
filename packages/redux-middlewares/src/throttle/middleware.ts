import throttle from 'lodash.throttle';

import { CANCEL_KEY, FLUSH_KEY, FsaAction } from './constants';

function map(throttled: Record<string, any>, action: FsaAction, method: string) {
  if (action.payload && action.payload.type) {
    let types = action.payload.type;
    if (!Array.isArray(types)) {
      types = [types];
    }
    Object.keys(throttled)
      .filter((t) => types.includes(t))
      .forEach((t) => throttled[t][method]());
    return;
  }
  Object.keys(throttled).forEach((t) => throttled[t][method]());
  return;
}

export function middleware(
  defaultWait = 300,
  defaultThrottleOption: {
    /**
     * @see _.leading
     */
    leading?: boolean;
    /**
     * @see _.trailing
     */
    trailing?: boolean;
    ignoreKey?: string;
  } = {}
) {
  const throttled = {};

  return (store: any) => (next: any) => (action: FsaAction) => {
    if (action.type === CANCEL_KEY) {
      map(throttled, action, 'cancel');
      return next(action);
    }

    if (action.type === FLUSH_KEY) {
      map(throttled, action, 'flush');
      return next(action);
    }

    const meta = action.meta || {};

    // 如果有忽略的 Key，则直接忽略
    if (defaultThrottleOption.ignoreKey && meta[defaultThrottleOption.ignoreKey]) {
      return next(action);
    }

    const shouldThrottle = meta.throttle;

    // check if we don't need to throttle the action
    if (!shouldThrottle) {
      return next(action);
    }

    if (throttled[action.type]) {
      // if it's a action which was throttled already
      return throttled[action.type](action);
    }

    let wait = defaultWait;
    let options = defaultThrottleOption;

    if (!isNaN(shouldThrottle) && shouldThrottle !== true) {
      wait = shouldThrottle;
    } else if (typeof shouldThrottle === 'object') {
      wait = shouldThrottle.wait || defaultWait;
      options = { ...defaultThrottleOption, ...shouldThrottle };
    }

    throttled[action.type] = throttle(next, wait, options);

    return throttled[action.type](action);
  };
}
