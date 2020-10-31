import { applicationContext, Service, Inject } from '../../src';

// HelloWorld Service and interface (could be in own file(s))
interface IHelloWorldService {
  helloWorld(): string;
}

@Service('HelloWorld')
export class HelloWorldService implements IHelloWorldService {
  constructor(
    private helloService: IHelloService, // OH NO! We did not add the "Inject" decorator! :(
    @Inject('WorldService') private worldService: IWorldService
  ) {
    return;
  }

  public helloWorld() {
    return `${this.helloService.hello()} ${this.worldService.world()}`;
  }
}

// Hello Service and interface (could be in own file(s))
interface IHelloService {
  hello(): string;
}

@Service('HelloService')
export class HelloService implements IHelloService {
  public hello() {
    return 'Hello';
  }
}

// World Service and interface (could be in own file(s))
interface IWorldService {
  world(): string;
}

@Service('WorldService')
export class WorldService implements IWorldService {
  public world() {
    return 'Decorator World!';
  }
}

// Main app/bootstrap
const helloWorldService = applicationContext.get<IHelloWorldService>(
  'HelloWorldService'
);
console.log(helloWorldService.helloWorld());
