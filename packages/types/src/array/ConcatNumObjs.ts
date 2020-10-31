import { NumObj } from '../util/NumObj';

import { IncIndexNumbObj } from './IncIndexNumbObj';
import { Length } from './Length';

/**
 * Concatenate the values of two object types with numerical keys, analogous to `Array.prototype.concat()`
 */
export type ConcatNumObjs<A extends NumObj<any>, B extends NumObj<any>> = A &
  IncIndexNumbObj<B, Length<A>>;
