import { NumberToString } from '../cast/NumberToString';
import { Inc } from '../number/Inc';
import { Spread } from '../object/Spread';
import { List } from '../util/List';

import { LengthList } from './LengthList';

/**
 * Append a value (type) to a numerically indexed type with explicit `length`, e.g. tuple. Returns a numerical object type.
 */
export type AppendList<
  R extends List<any>,
  T,
  Len extends number = LengthList<R>
> = Spread<R & { [P in NumberToString[Len]]: T }, { length: Inc[Len] }>;
