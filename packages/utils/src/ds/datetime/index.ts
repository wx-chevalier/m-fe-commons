export * from './calendar';
export * from './format';

import { inBrowser } from '../../env';

export const now: () => number = inBrowser
  ? () => window.performance.now()
  : () => Date.now();

// 从时间字符串中计算出秒数 13 : 28 : 44
export function getSFromHMS(hms: string) {
  const hmsList = hms.replace('-', '').replace(/ /g, '').split(':');

  return (
    Number(hmsList[0]) * 3600 + Number(hmsList[1]) * 60 + Number(hmsList[2])
  );
}
