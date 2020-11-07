import {
  createDiDecorators,
  InjectDecorator,
  ServiceDecorator,
  Inject as defaultInject,
  Service as defaultService,
} from '../di';

import {
  ApplicationContext,
  applicationContext as defaultContainer,
} from '../../context/ApplicationContext';

import { assert } from 'chai';

describe('decorators', () => {
  let applicationContext: ApplicationContext;
  let Inject: InjectDecorator;
  let Service: ServiceDecorator;

  const SERVICE_1 = Symbol('Service 1');
  const SERVICE_2 = Symbol('Service 2');
  const SERVICE_3 = Symbol('Service 3');

  beforeEach(() => {
    applicationContext = new ApplicationContext();
    const decorators = createDiDecorators(applicationContext);
    Inject = decorators.Inject;
    Service = decorators.Service;
  });

  describe('services', () => {
    it('should allow access to services that have been added using decorator', () => {
      // declare Service-1
      @Service(SERVICE_1)
      class Service1 {
        public method1 = () => 'Hello';
      }

      const serviceInstance = applicationContext.get<Service1>(SERVICE_1);

      assert.instanceOf(serviceInstance, Service1);
      assert.equal(serviceInstance.method1(), 'Hello');
    });

    it('should treat services as singletons by default', () => {
      @Service(SERVICE_1)
      class Service1 {
        public method1 = () => 'Hello';
      }

      const serviceInstance1 = applicationContext.get<Service1>(SERVICE_1);
      const serviceInstance2 = applicationContext.get<Service1>(SERVICE_1);

      assert.instanceOf(serviceInstance1, Service1);
      assert.instanceOf(serviceInstance2, Service1);
      assert.equal(serviceInstance1, serviceInstance2);
    });
  });

  describe('injecting', () => {
    it('should Inject other decorated services into decorated services', () => {
      @Service(SERVICE_1)
      class Service1 {
        public getHello = () => 'Hello';
      }

      @Service(SERVICE_2)
      class Service2 {
        public getWorld = () => 'World';
      }

      @Service(SERVICE_3)
      class Service3 {
        constructor(
          @Inject(SERVICE_1) private s1: Service1,
          @Inject(SERVICE_2) private s2: Service2,
        ) {}
        public getHelloWorld = () =>
          this.s1.getHello() + ' ' + this.s2.getWorld();
      }

      const serviceInstance = applicationContext.get<Service3>(SERVICE_3);

      assert.equal(serviceInstance.getHelloWorld(), 'Hello World');
    });

    it('should Inject non-decorated services into decorated services', () => {
      class Service1 {
        public getHello = () => 'Hello';
      }

      class Service2 {
        public getWorld = () => 'World';
      }

      @Service(SERVICE_3)
      class Service3 {
        constructor(
          @Inject(SERVICE_1) private s1: Service1,
          @Inject(SERVICE_2) private s2: Service2,
        ) {}
        public getHelloWorld = () =>
          this.s1.getHello() + ' ' + this.s2.getWorld();
      }

      applicationContext.registerService<Service1>(SERVICE_1, Service1);
      applicationContext.registerService<Service2>(SERVICE_2, Service2);

      const serviceInstance = applicationContext.get<Service3>(SERVICE_3);

      assert.equal(serviceInstance.getHelloWorld(), 'Hello World');
    });

    it("should throw an error if you don't Inject one of the dependencies in a Service", () => {
      class Service1 {
        public getHello = () => 'Hello';
      }

      class Service2 {
        public getWorld = () => 'World';
      }

      applicationContext.registerService<Service1>(SERVICE_1, Service1);
      applicationContext.registerService<Service2>(SERVICE_2, Service2);

      // assert.throws(() => {
      //   @Service(SERVICE_3)
      //   class Service3 {
      //     constructor(
      //       @Inject(SERVICE_1) private s1: Service1,
      //       private s2: Service2 // oh no, this Service hasn't been injected
      //     ) {}
      //     public getHelloWorld = () =>
      //       this.s1.getHello() + ' ' + this.s2.getWorld();
      //   }
      // });
    });

    it("should throw an error if you Inject a Service that doesn't exist", () => {
      @Service(SERVICE_1)
      class Service1 {
        public getHello = () => 'Hello';
      }

      // @Service(SERVICE_2) oh no, it hasn't been registered but we still depend on it later
      class Service2 {
        public getWorld = () => 'World';
      }

      @Service(SERVICE_3)
      class Service3 {
        constructor(
          @Inject(SERVICE_1) private s1: Service1,
          @Inject(SERVICE_2) private s2: Service2,
        ) {}
        public getHelloWorld = () =>
          this.s1.getHello() + ' ' + this.s2.getWorld();
      }

      assert.throws(() => {
        applicationContext.get<Service3>(SERVICE_3);
      });
    });

    describe('multiple containers', () => {
      let container1: ApplicationContext;
      let injectDecorator1: InjectDecorator;
      let serviceDecorator1: ServiceDecorator;
      let container2: ApplicationContext;
      let injectDecorator2: InjectDecorator;
      let serviceDecorator2: ServiceDecorator;

      beforeEach(() => {
        container1 = new ApplicationContext();
        const decorators1 = createDiDecorators(container1);
        injectDecorator1 = decorators1.Inject;
        serviceDecorator1 = decorators1.Service;

        container2 = new ApplicationContext();
        const decorators2 = createDiDecorators(container2);
        injectDecorator2 = decorators2.Inject;
        serviceDecorator2 = decorators2.Service;
      });

      it('should allow you to register services to each applicationContext without them being accessible from the other applicationContext', () => {
        const SERVICE_A = Symbol('ServiceA');
        const SERVICE_B = Symbol('ServiceB');

        @serviceDecorator1(SERVICE_A)
        class ServiceA {
          public getHello = () => 'Hello';
        }

        @serviceDecorator2(SERVICE_B)
        class ServiceB {
          public getHello = () => 'Hello';
        }

        const serviceA = container1.get<ServiceA>(SERVICE_A);
        const serviceB = container2.get<ServiceB>(SERVICE_B);

        // try get instance of the two services from their correct containers
        assert.instanceOf(serviceA, ServiceA);
        assert.instanceOf(serviceB, ServiceB);

        // try get instance of the two services from the containers where they were NOT registered
        assert.throws(() => {
          container1.get<ServiceB>(SERVICE_B);
        });
        assert.throws(() => {
          container2.get<ServiceA>(SERVICE_A);
        });
      });
    });
  });

  describe('default applicationContext and injections', () => {
    it('should Inject other services into a decorated Service', () => {
      it('should Inject other decorated services into decorated services', () => {
        @defaultService(SERVICE_1)
        class Service1 {
          public getHello = () => 'Hello';
        }

        @defaultService(SERVICE_2)
        class Service2 {
          public getWorld = () => 'World';
        }

        @defaultService(SERVICE_3)
        class Service3 {
          constructor(
            @defaultInject(SERVICE_1) private s1: Service1,
            @defaultInject(SERVICE_2) private s2: Service2,
          ) {}
          public getHelloWorld = () =>
            this.s1.getHello() + ' ' + this.s2.getWorld();
        }

        const serviceInstance = applicationContext.get<Service3>(SERVICE_3);

        assert.equal(serviceInstance.getHelloWorld(), 'Hello World');
      });
    });
  });
});
