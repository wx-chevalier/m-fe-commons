import { ListFrom } from '../array/ListFrom';
import { List } from '../util/List';

import { LengthList } from './LengthList';

/**
 * Filter a tuple-like type by stripping out any indices used in a second tuple-like.
 */
export type DifferenceLists<
  Big extends List<any>,
  Small extends List<any>
  // @ts-ignore
> = ListFrom<Big, LengthList<Small>>;
