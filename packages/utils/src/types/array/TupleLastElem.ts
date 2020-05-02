import { Dec } from '../number/Dec';
import { Inc } from '../number/Inc';
import { List } from '../util/List';

import { TupleHasIndex } from './TupleHasIndex';

/**
 * Get the last element of a tuple-like type
 */
export type TupleLastElem<R extends List<any>, I extends number = 0> = {
  1: TupleLastElem<R, Inc[I]>;
  0: R[Dec[I]];
}[TupleHasIndex<R, I>];
