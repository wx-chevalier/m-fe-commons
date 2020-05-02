import { Matches } from '../type/Matches';

import { Dec } from './Dec';
import { Inc } from './Inc';

/**
 * Add two numbers.
 */
// @ts-ignore
export type Add<A extends number, B extends number> = {
  1: A;
  0: Add<Inc[A], Dec[B]>;
}[Matches<B, 0>];
