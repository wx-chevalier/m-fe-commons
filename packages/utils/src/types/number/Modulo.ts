import { Gt } from '../comp/Gt';

import { Inc } from './Inc';
import { Subtract } from './Subtract';
/**
 * Take the modulo of two numbers.
 */
export type Modulo<A extends number, B extends number, Acc extends number = 0> =
  // @ts-ignore
  { 0: A; 1: Modulo<Subtract<A, B>, B, Inc[Acc]> }[Gt<A, B>];
