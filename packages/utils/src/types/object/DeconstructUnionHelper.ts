import { UnionToIntersection } from '../union/UnionToIntersection';

export type DeconstructUnionHelper<T> = T &
  Partial<
    // @ts-ignore
    Pick<UnionToIntersection<T>, Exclude<keyof UnionToIntersection<T>, keyof T>>
  >;
