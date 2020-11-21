import { TupleHasIndex } from '../array/TupleHasIndex';
import { Intersection } from '../util/Intersection';

import { ObjectHasKey } from './ObjectHasKey';

/**
 * Check if a type (object or tuple) has a certain key.
 */
export type HasKey<T, K extends number | string> = T extends any[]
  ? TupleHasIndex<T & { length: number }, Intersection<number, K>>
  : ObjectHasKey<T, Intersection<string, K>>;
