import { NumberToString } from '../cast/NumberToString';
import { Inc } from '../number/Inc';
import { Subtract } from '../number/Subtract';
import { ObjectHasKey } from '../object/ObjectHasKey';
import { List } from '../util/List';

/**
 * Decrease the indexes on a numerically indexed object by a given amount.
 */
export type DecIndex<
  R extends List<any>,
  N extends number,
  I extends number = R[0],
  Acc = { length: R['length'] }
> = {
  0: Acc;
  1: DecIndex<
    R,
    N,
    Inc[I],
    // @ts-ignore
    Acc & { [P in NumberToString[Subtract<I, N>]]: R[I] }
  >;
}[ObjectHasKey<R, NumberToString[I]>];
