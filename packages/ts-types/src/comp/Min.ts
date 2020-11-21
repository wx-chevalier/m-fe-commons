import { If } from '../util/If';

import { Lt } from './Lt';

/**
 * Get the lowest of two number literals.
 */
// @ts-ignore
export type Min<A extends number, B extends number> = If<Lt<A, B>, A, B>;
