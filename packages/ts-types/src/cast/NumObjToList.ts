import { Length } from '../array/Length';
import { NumObj } from '../util/NumObj';

/**
 * Add an explicit `length` to an object type with number keys.
 */
export type NumObjToList<O extends NumObj<any>> = O & { length: Length<O> };
