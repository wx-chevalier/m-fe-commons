import { Bool } from '../util/Bool';

import { And } from './And';
import { Determinate } from './Determinate';
import { Not } from './Not';

/**
 * Checks whether a string bool has `'0'`, yet not `'1'`.
 */
export type DefinitelyNo<T extends Bool> = And<Not<T>, Determinate<T>>;
