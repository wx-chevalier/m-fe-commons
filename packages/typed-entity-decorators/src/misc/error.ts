import { DependencyIdentifier } from '../types';

class DependencyError extends Error {}

export class CircularDependencyError extends DependencyError {
  private dependencyChain = new Array<DependencyIdentifier>();

  constructor(terminalDependencyIdentifier: DependencyIdentifier) {
    super();
    this.addDependencyToChain(terminalDependencyIdentifier);
  }

  public addDependencyToChain(dependecyIdentifier: DependencyIdentifier) {
    this.dependencyChain.push(dependecyIdentifier);
    this.updateErrorMessage();
  }

  private updateErrorMessage() {
    const dependencyChainString = this.dependencyChain
      .map(d => d.toString())
      .reverse()
      .join(' -> ');
    this.message = `Circular dependency found: ${dependencyChainString}`;
  }
}

export class DependencyNotFoundError extends DependencyError {
  constructor(dependencyIdentifier: DependencyIdentifier) {
    super(`Dependency not found: ${dependencyIdentifier.toString()}`);
  }
}

export class ServiceNotDecoratedError extends DependencyError {
  constructor(dependencyIdentifier: DependencyIdentifier) {
    super(
      `Injecting dependencies into ${dependencyIdentifier.toString()} but it is not decorated with @Service`,
    );
  }
}

export class MissingDependencyError extends DependencyError {
  constructor(
    dependencyIdentifier: DependencyIdentifier,
    indexOfMissingDependency: number,
  ) {
    super(
      `Error with '${dependencyIdentifier.toString()}'. Dependency not registered at index ${indexOfMissingDependency}`,
    );
  }
}

export class AddDependencyError extends DependencyError {
  constructor(
    serviceIdentifier: DependencyIdentifier,
    newDependencyName: DependencyIdentifier,
    indexOfDependency: number,
    message: string,
  ) {
    super(
      `Error adding dependency ${newDependencyName.toString()} to ${serviceIdentifier.toString()} at position ${indexOfDependency}. ${message}`,
    );
  }
}
