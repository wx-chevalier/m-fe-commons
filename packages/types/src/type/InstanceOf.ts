import { And } from '../boolean/And';
import { Not } from '../boolean/Not';

import { Matches } from './Matches';

/**
 * Check if a type is an instance of another, that is, matches it but is not equal (`<`).
 */
export type InstanceOf<V, T> = And<Matches<V, T>, Not<Matches<T, V>>>;
