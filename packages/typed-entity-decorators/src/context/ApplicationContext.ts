import { DependencyNotFoundError } from '../misc/error';
import { ConstantFactory } from './ConstantFactory';
import { BeanFactory } from './BeanFactory';
import { Service } from '../types';
import {
  DependencyIdentifier,
  WrappedDependency,
  Dependency,
  DependencyOptions,
  Factory,
} from '../types';

export class ApplicationContext {
  private registeredDependencies = new Map<
    DependencyIdentifier,
    WrappedDependency<Dependency>
  >();

  public registerFactory<T>(
    serviceIdentifier: DependencyIdentifier,
    factory: Factory<T>,
    options: DependencyOptions = { isSingleton: true },
  ) {
    const wrappedDependency = new BeanFactory(
      serviceIdentifier,
      factory,
      options,
      this,
    );

    this.registeredDependencies.set(serviceIdentifier, wrappedDependency);

    return wrappedDependency;
  }

  public registerService<T>(
    serviceIdentifier: DependencyIdentifier,
    Service: Service<T>,
    options: DependencyOptions = { isSingleton: true },
  ) {
    // convert the Service into a factory
    const factory = (...dependencies: Array<Dependency>) => {
      return new Service(...dependencies);
    };

    // So we can better handle errors by knowing how many dependencies the Service should have
    Object.defineProperty(factory, 'length', { value: Service.length });

    const wrappedDependency = new BeanFactory(
      serviceIdentifier,
      factory,
      options,
      this,
    );

    this.registeredDependencies.set(serviceIdentifier, wrappedDependency);

    return wrappedDependency;
  }

  public registerConstant<T>(
    constantIdentifier: DependencyIdentifier,
    dependency: T,
  ) {
    const wrappedDependency = new ConstantFactory<T>(
      constantIdentifier,
      dependency,
    );

    this.registeredDependencies.set(constantIdentifier, wrappedDependency);

    return wrappedDependency;
  }

  public get<T>(dependencyIdentifer: DependencyIdentifier): T {
    const wrappedDependency = this.registeredDependencies.get(
      dependencyIdentifer,
    );

    if (!wrappedDependency) {
      throw new DependencyNotFoundError(dependencyIdentifer);
    }

    return wrappedDependency.getInstance();
  }

  public clear() {
    this.registeredDependencies = new Map<
      DependencyIdentifier,
      WrappedDependency<Dependency>
    >();
  }
}

export const applicationContext = new ApplicationContext();
