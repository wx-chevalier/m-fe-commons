import { applicationContext, Service, Inject } from '../../src';

// Dependency identifiers (could be in own file)
const HELLO_SERVICE = Symbol('HelloService');
const WORLD_SERVICE = Symbol('WorldService');
const HELLO_WORLD_SERVICE = Symbol('WorldService');

// Hello Service and interface (could be in own file(s))
interface IHelloService {
  hello(): string;
}

@Service(HELLO_SERVICE)
export class HelloService implements IHelloService {
  public hello() {
    return 'Hello';
  }
}

// World Service and interface (could be in own file(s))
interface IWorldService {
  world(): string;
}

@Service(WORLD_SERVICE)
export class WorldService implements IWorldService {
  public world() {
    return 'Decorator World!';
  }
}

// HelloWorld Service and interface (could be in own file(s))
interface IHelloWorldService {
  helloWorld(): string;
}

@Service(HELLO_WORLD_SERVICE)
export class HelloWorldService implements IHelloWorldService {
  constructor(
    @Inject(HELLO_SERVICE) private helloService: IHelloService,
    @Inject(WORLD_SERVICE) private worldService: IWorldService
  ) {
    return;
  }

  public helloWorld() {
    return `${this.helloService.hello()} ${this.worldService.world()}`;
  }
}

// Main app/bootstrap
const helloWorldService = applicationContext.get<IHelloWorldService>(
  HELLO_WORLD_SERVICE
);

console.log(helloWorldService.helloWorld());
