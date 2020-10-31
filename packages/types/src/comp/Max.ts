import { If } from '../util/If';

import { Gt } from './Gt';

/**
 * Get the highest of two number literals.
 */
// @ts-ignore
export type Max<A extends number, B extends number> = If<Gt<A, B>, A, B>;
