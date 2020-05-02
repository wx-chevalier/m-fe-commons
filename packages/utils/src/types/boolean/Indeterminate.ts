import { Matches } from '../type/Matches';

import { And } from './And';

/**
 * Checks whether a string bool has an interminate result, that is, `'1' | '0'`.
 */
export type Indeterminate<T extends string> = And<
  Matches<'0', T>,
  Matches<'1', T>
>;
