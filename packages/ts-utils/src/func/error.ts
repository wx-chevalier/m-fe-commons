import { inBrowser } from '../env/browser';
import { warn } from './log';

/** 处理异常 */
export function handleError(
  err: Error,
  vm: any,
  info: string,
  config: any = {},
) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Error in ${info}: "${err.toString()}"`, vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err;
    }
  }
}
