import { Matches } from '../type/Matches';

import { Dec } from './Dec';

/**
 * Subtract two numbers.
 */
// @ts-ignore
export type Subtract<A extends number, B extends number> = {
  1: A;
  0: Subtract<Dec[A], Dec[B]>;
}[Matches<B, 0>];
