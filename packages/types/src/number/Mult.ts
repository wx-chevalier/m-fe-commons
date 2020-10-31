import { Matches } from '../type/Matches';

import { Add } from './Add';
import { Dec } from './Dec';

/**
 * Multiply two numbers.
 */
export type Mult<A extends number, B extends number, Acc extends number = 0> =
  // @ts-ignore
  {
    1: Acc;
    // @ts-ignore
    0: Mult<A, Dec[B], Add<Acc, A>>;
  }[Matches<B, 0>];
