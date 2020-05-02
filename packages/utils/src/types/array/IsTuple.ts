import { And } from '../boolean/And';
import { InstanceOf } from '../type/InstanceOf';

import { IsArrayType } from './IsArrayType';

/**
 * Check whether a type is a tuple type
 */
export type IsTuple<T extends { length: number }> = And<
  IsArrayType<T>,
  InstanceOf<T['length'], number>
>;
