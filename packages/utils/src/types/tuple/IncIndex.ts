import { NumberToString } from '../cast/NumberToString';
import { Add } from '../number/Add';
import { Inc } from '../number/Inc';
import { ObjectHasKey } from '../object/ObjectHasKey';
import { List } from '../util/List';

/**
 * Increase the indexes on a numerically indexed object by a given amount.
 */
export type IncIndex<
  R extends List<any>,
  N extends number,
  I extends number = 0 /*FirstIndex<R>*/,
  Acc = { length: R['length'] }
> = {
  0: Acc;
  // @ts-ignore
  1: IncIndex<R, N, Inc[I], Acc & { [P in NumberToString[Add<I, N>]]: R[I] }>;
}[ObjectHasKey<R, NumberToString[I]>];
