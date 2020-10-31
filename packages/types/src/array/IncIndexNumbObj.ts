import { NumberToString } from '../cast/NumberToString';
import { Add } from '../number/Add';
import { Inc } from '../number/Inc';
import { ObjectHasKey } from '../object/ObjectHasKey';
import { NumObj } from '../util/NumObj';

import { Length } from './Length';

/**
 * Increase the number keys of an object type by the given amount
 */
export type IncIndexNumbObj<
  R extends NumObj<any>,
  N extends number,
  I extends number = 0 /*FirstIndex<R>*/,
  Acc = { length: Length<R> }
> = {
  0: Acc;
  1: IncIndexNumbObj<
    R,
    N,
    Inc[I],
    // @ts-ignore
    Acc & { [P in NumberToString[Add<I, N>]]: R[I] }
  >;
}[ObjectHasKey<R, NumberToString[I]>];
