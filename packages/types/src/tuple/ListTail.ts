import { ListFrom } from '../array/ListFrom';
import { List } from '../util/List';

/**
 * Return the subset of a tuple-like type containing all but the first element.
 */
export type ListTail<R extends List<any>> = ListFrom<R, 1>;
