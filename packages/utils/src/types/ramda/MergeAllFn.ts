import { TupleHasIndex } from '../array/TupleHasIndex';
import { Inc } from '../number/Inc';
import { Spread } from '../object/Spread';
import { List } from '../util/List';
import { Obj } from '../util/Obj';

/**
 * Merges a list of objects together into one object.
 * @see http://ramdajs.com/docs/#mergeAll
 */
export type MergeAllFn<
  R extends List<Obj<any>>,
  I extends number = 0,
  T = {}
> = { 1: MergeAllFn<R, Inc[I], Spread<T, R[I]>>; 0: T }[TupleHasIndex<R, I>];
