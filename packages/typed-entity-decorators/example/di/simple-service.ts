import { applicationContext, Service, Inject } from '../../src';

class HelloService {
  public hello() {
    return 'Hello';
  }
}

class WorldService {
  public world() {
    return 'Service World';
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

applicationContext.registerService('HelloService', HelloService);

applicationContext.registerService('WorldService', WorldService);

applicationContext
  .registerService('HelloWorldService', HelloWorldService)
  .addDependencies('HelloService', 'WorldService');

const helloWorldService = applicationContext.get<HelloWorldService>(
  'HelloWorldService'
);
console.log(helloWorldService.helloWorld());
