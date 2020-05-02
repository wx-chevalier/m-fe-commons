import { Matches } from '../type/Matches';

import { Falsy } from './Falsy';

/**
 * Checks whether a type literal is falsy.
 */
export type IsFalsy<V> = Matches<V, Falsy>;
