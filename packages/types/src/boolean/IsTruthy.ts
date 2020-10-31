import { IsFalsy } from './IsFalsy';
import { Not } from './Not';

/**
 * Checks whether a type literal is truthy.
 */
export type IsTruthy<V> = Not<IsFalsy<V>>;
