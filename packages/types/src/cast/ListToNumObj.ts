import { Omit } from '../object/Omit';
import { List } from '../util/List';

/**
 * Strip a (numerically indexed) type of its `length`.
 */
export type ListToNumObj<R extends List<any>> = Omit<R, 'length'>;
