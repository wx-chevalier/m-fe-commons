import 'reflect-metadata';

export type Constructor = { new (...args: any[]): {} };

export interface TypedPropertyDescriptor<T> {
  enumerable?: boolean;
  configurable?: boolean;
  writable?: boolean;
  value?: T;
  get?: () => T;
  set?: (value: T) => void;
}

export type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void;

export type PropertyDecorator = (
  target: Object,
  propertyKey: string | symbol
) => void;

export type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

export type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) => void;

export type Dependency = any;

export interface DependencyOptions {
  isSingleton: boolean;
}

export interface WrappedDependency<T> {
  getInstance(): T;
}

export type Factory<T> = (...dependencies: Array<Dependency>) => T;
export type Service<T> = new (...dependencies: Array<Dependency>) => T;

export type DependencyIdentifier = Symbol | string;
