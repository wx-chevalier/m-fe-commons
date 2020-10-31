import { applicationContext, Service, Inject } from '../../src';

interface IHelloService {
  hello(): string;
}

class HelloService implements IHelloService {
  public hello() {
    return 'Hello';
  }
}

class BonjourService implements IHelloService {
  public hello() {
    return 'Bonjour';
  }
}

class WorldService {
  public world() {
    return 'World';
  }
}

class HelloWorldService {
  constructor(
    private helloService: HelloService,
    private worldService: WorldService
  ) {}

  public helloWorld() {
    return `${this.helloService.hello()} ${this.worldService.world()}`;
  }
}

// Register services/dependencies as usual
applicationContext.registerService<IHelloService>('HelloService', HelloService);
applicationContext.registerService('WorldService', WorldService);
applicationContext
  .registerService('HelloWorldService', HelloWorldService)
  .addDependencies('HelloService', 'WorldService');

applicationContext.registerService<IHelloService>(
  'HelloService',
  BonjourService
);

const helloWorldService = applicationContext.get<HelloWorldService>(
  'HelloWorldService'
);
console.log(helloWorldService.helloWorld());
