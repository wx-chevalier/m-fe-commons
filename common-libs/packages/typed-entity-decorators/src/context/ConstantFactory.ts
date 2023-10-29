import { DependencyIdentifier, WrappedDependency } from '../types';

export class ConstantFactory<T> implements WrappedDependency<T> {
  constructor(private identifer: DependencyIdentifier, private instance: T) {}

  public getInstance(): T {
    return this.instance;
  }

  public getIdentifier() {
    return this.identifer;
  }
}
