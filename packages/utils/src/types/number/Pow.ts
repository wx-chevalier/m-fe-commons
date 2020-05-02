import { Matches } from '../type/Matches';

import { Dec } from './Dec';
import { Mult } from './Mult';

/**
 * Return the given power of a number.
 */
export type Pow<
  Base extends number,
  Exp extends number,
  Acc extends number = 1
> =
  // @ts-ignore
  { 1: Acc; 0: Pow<Base, Dec[Exp], Mult<Acc, Base>> }[Matches<Exp, 0>];
