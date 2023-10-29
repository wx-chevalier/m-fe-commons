import { applicationContext, Service, Inject } from '../../src';

class ServiceA {
  private static numberOfInstancesOfClass = 0;
  private numberOfTimesTestMethodCalled = 0;

  constructor() {
    ServiceA.numberOfInstancesOfClass++;
  }

  public test() {
    this.numberOfTimesTestMethodCalled++;
    console.log(
      `Service A has ${
        ServiceA.numberOfInstancesOfClass
      } instances and the test function has been called ${
        this.numberOfTimesTestMethodCalled
      } time(s)`
    );
  }
}

class ServiceB {
  private static numberOfInstancesOfClass = 0;
  private numberOfTimesTestMethodCalled = 0;

  constructor() {
    ServiceB.numberOfInstancesOfClass++;
  }

  public test() {
    this.numberOfTimesTestMethodCalled++;
    console.log(
      `Service B has ${
        ServiceB.numberOfInstancesOfClass
      } instances and the test function has been called ${
        this.numberOfTimesTestMethodCalled
      } time(s)`
    );
  }
}

applicationContext.registerService('ServiceA', ServiceA, { isSingleton: true }); // default behavior
applicationContext.registerService('ServiceB', ServiceB, {
  isSingleton: false
}); // override default behavior

console.log('Creating three instances of the singleton:');
const instance1ServiceA = applicationContext.get<ServiceA>('ServiceA');
instance1ServiceA.test();
const instance2ServiceA = applicationContext.get<ServiceA>('ServiceA');
instance2ServiceA.test();
const instance3ServiceA = applicationContext.get<ServiceA>('ServiceA');
instance3ServiceA.test();

console.log('\nCreating three instances of the transients:');
const instance1ServiceB = applicationContext.get<ServiceB>('ServiceB');
instance1ServiceB.test();
const instance2ServiceB = applicationContext.get<ServiceB>('ServiceB');
instance2ServiceB.test();
const instance3ServiceB = applicationContext.get<ServiceB>('ServiceB');
instance3ServiceB.test();
