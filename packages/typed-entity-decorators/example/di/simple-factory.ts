import { applicationContext, Service, Inject } from '../../src';

interface IHelloService {
  hello(): string;
}

type IWorldFunction = () => string;

interface IHelloWorldService {
  helloWorld(): string;
}

applicationContext.registerFactory<IHelloService>('HelloService', () => {
  return {
    hello: () => 'Hello'
  };
});

applicationContext.registerFactory<IWorldFunction>('WorldFunction', () => {
  return () => 'Factory World!';
});

applicationContext
  .registerFactory<IHelloWorldService>(
    'HelloWorldService',
    (helloService: IHelloService, worldFunction: IWorldFunction) => {
      return {
        helloWorld: () => `${helloService.hello()} ${worldFunction()}`
      };
    }
  )
  .addDependencies('HelloService', 'WorldFunction');

const helloWorldService = applicationContext.get<IHelloWorldService>(
  'HelloWorldService'
);

console.log(helloWorldService.helloWorld());
