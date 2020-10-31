import {
  CircularDependencyError,
  MissingDependencyError,
  AddDependencyError
} from '../misc/error';
import { ApplicationContext } from './ApplicationContext';
import {
  WrappedDependency,
  DependencyIdentifier,
  Factory,
  DependencyOptions
} from '../types';

export class BeanFactory<T> implements WrappedDependency<T> {
  private instance: T;
  private isBeingInstantiated = false;

  private dependencies = new Array<DependencyIdentifier>();

  constructor(
    private identifier: DependencyIdentifier,
    private factoryFunction: Factory<T>,
    private options: DependencyOptions,
    private applicationContext: ApplicationContext
  ) {}

  public getInstance(): T {
    if (this.instance) {
      return this.instance;
    }

    // if we are already in the process of instanciating this dependency then we must
    // be in the middle of a circular dependency
    if (this.isBeingInstantiated) {
      throw new CircularDependencyError(this.identifier);
    }

    const instance = this.createInstance();

    if (this.options.isSingleton) {
      this.instance = instance;
    }

    return instance;
  }

  public addDependencies(...dependenciesNames: Array<DependencyIdentifier>) {
    this.dependencies = dependenciesNames;
    this.ensureCorrectNumberOfDependencies();
  }

  public addDependency(
    dependencyIdentifier: DependencyIdentifier,
    paramIndex: number
  ) {
    if (this.dependencies[paramIndex]) {
      throw new AddDependencyError(
        this.identifier,
        dependencyIdentifier,
        paramIndex,
        'Dependency at that position already exists'
      );
    }

    if (paramIndex >= this.factoryFunction.length) {
      throw new AddDependencyError(
        this.identifier,
        dependencyIdentifier,
        paramIndex,
        `Service only has ${this.factoryFunction.length} dependencies`
      );
    }

    this.dependencies[paramIndex] = dependencyIdentifier;

    return this;
  }

  private locateIndexOfMissingDependency(): number {
    if (this.dependencies.length !== this.factoryFunction.length) {
      return this.dependencies.length;
    }

    for (let i = 0; i < this.dependencies.length; i++) {
      if (!this.dependencies[i]) {
        return i;
      }
    }
    return -1;
  }

  private ensureCorrectNumberOfDependencies() {
    const indexOfMissingDependency = this.locateIndexOfMissingDependency();
    if (indexOfMissingDependency !== -1) {
      throw new MissingDependencyError(
        this.identifier,
        indexOfMissingDependency
      );
    }
  }

  private createInstance() {
    this.ensureCorrectNumberOfDependencies();

    this.isBeingInstantiated = true;

    let newInstance;
    try {
      newInstance = this.factoryFunction(...this.getDependencies());
    } catch (error) {
      if (error instanceof CircularDependencyError) {
        error.addDependencyToChain(this.identifier);
      }

      throw error;
    } finally {
      this.isBeingInstantiated = false;
    }

    return newInstance;
  }

  private getDependencies() {
    return this.dependencies.map((dependencyIdentifier, index) => {
      if (!dependencyIdentifier) {
        throw new MissingDependencyError(this.identifier, index);
      }

      return this.applicationContext.get(dependencyIdentifier);
    });
  }
}
