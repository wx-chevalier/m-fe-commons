import { Bool } from '../util/Bool';

import { Indeterminate } from './Indeterminate';
import { Not } from './Not';

/**
 * Checks whether a string bool has an terminate result, that is, either `'1'` or `'0'`, but not their union.
 */
export type Determinate<T extends Bool> = Not<Indeterminate<T>>;
