import { Matches } from '../type/Matches';

import { ObjectValsToUnion } from './ObjectValsToUnion';

/**
 * Check whether a heterogeneous object type contains a given type among its elements.
 */
export type ObjectHasElem<T, E> = Matches<E, ObjectValsToUnion<T>>;
