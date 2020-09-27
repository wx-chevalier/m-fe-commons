export * from './calendar';
export * from './format';

import { inBrowser } from '../../env';

export const now: () => number = inBrowser
  ? () => window.performance.now()
  : () => Date.now();
