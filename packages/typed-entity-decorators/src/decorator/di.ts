import { DependencyIdentifier, DependencyOptions, Service } from '../types';
import {
  applicationContext as defaultContainer,
  ApplicationContext,
} from '../context';

import { ServiceNotDecoratedError } from '../misc';

export type ServiceDecorator = (
  dependencyIdentifier: DependencyIdentifier,
  dependencyOptions?: DependencyOptions,
) => Function;

export type InjectDecorator = (
  dependencyIdentifier: DependencyIdentifier,
) => Function;

export function createDiDecorators(
  applicationContext: ApplicationContext,
): { Service: ServiceDecorator; Inject: InjectDecorator } {
  let currentServiceIdentifier: DependencyIdentifier | null;
  let currentService: Service<any> | null;
  let dependenciesWaitingToBeInjected: Array<DependencyIdentifier>;
  resetInjections();

  function resetInjections() {
    currentServiceIdentifier = null;
    currentService = null;
    dependenciesWaitingToBeInjected = new Array<DependencyIdentifier>();
  }

  function serviceDecorator(
    dependencyIdentifier: DependencyIdentifier,
    dependencyOptions: DependencyOptions = { isSingleton: true },
  ) {
    return function(targetService: Service<any>) {
      if (currentService !== null && currentService !== targetService) {
        const erroredServiceIdentifer = currentServiceIdentifier;
        resetInjections();
        throw new ServiceNotDecoratedError(erroredServiceIdentifer!);
      }

      try {
        applicationContext
          .registerService(
            dependencyIdentifier,
            targetService,
            dependencyOptions,
          )
          .addDependencies(...dependenciesWaitingToBeInjected);
      } catch (e) {
        throw e;
      } finally {
        resetInjections();
      }
    };
  }

  function injectDecorator(dependencyIdentifier: DependencyIdentifier) {
    return function(
      targetService: Service<any>,
      propertyKey: string | symbol,
      parameterIndex: number,
    ) {
      if (currentService !== null && currentService !== targetService) {
        const erroredServiceIdentifer = currentServiceIdentifier;
        resetInjections();
        throw new ServiceNotDecoratedError(erroredServiceIdentifer!);
      }
      currentServiceIdentifier = dependencyIdentifier;
      currentService = targetService;
      dependenciesWaitingToBeInjected[parameterIndex] = dependencyIdentifier;
    };
  }

  return {
    Service: serviceDecorator,
    Inject: injectDecorator,
  };
}

const { Service, Inject } = createDiDecorators(defaultContainer);
export { Service, Inject };
