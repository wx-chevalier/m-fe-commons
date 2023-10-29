import { NumberToString } from '../cast/NumberToString';
import { NumObj } from '../util/NumObj';

import { Length } from './Length';

/**
 * Append a value to the end of an object type with numerical keys
 */
export type AppendNumObj<
  R extends NumObj<any>,
  T,
  Len extends number = Length<R>
> = R & { [P in NumberToString[Len]]: T };
