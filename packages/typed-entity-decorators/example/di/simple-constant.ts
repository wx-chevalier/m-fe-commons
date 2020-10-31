import { applicationContext, Service, Inject } from '../../src';

class HelloWorldService {
  constructor(private helloConstant: string, private worldConstant: string) {}

  public helloWorld() {
    return `${this.helloConstant} ${this.worldConstant}`;
  }
}

applicationContext.registerConstant<string>('HelloConstant', 'Hello');

applicationContext.registerConstant<string>('WorldConstant', 'Constant World');

applicationContext
  .registerService('HelloWorldService', HelloWorldService)
  .addDependencies('HelloConstant', 'WorldConstant');

const helloWorldService = applicationContext.get<HelloWorldService>(
  'HelloWorldService'
);
console.log(helloWorldService.helloWorld());
