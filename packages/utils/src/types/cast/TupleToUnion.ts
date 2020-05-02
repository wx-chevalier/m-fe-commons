import { TupleHasIndex } from '../array/TupleHasIndex';
import { Inc } from '../number/Inc';
import { List } from '../util/List';

/**
 * Get a union of types from the elements of a tuple-like type.
 */
export type TupleToUnion<
  R extends List<any>,
  I extends number = 0,
  Acc = never
> = { 1: TupleToUnion<R, Inc[I], Acc | R[I]>; 0: Acc }[TupleHasIndex<R, I>];
