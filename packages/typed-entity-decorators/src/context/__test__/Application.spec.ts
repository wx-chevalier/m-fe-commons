import { ApplicationContext } from '../ApplicationContext';
import { assert } from 'chai';

describe('Container', () => {
  let applicationContext: ApplicationContext;

  beforeEach(() => {
    applicationContext = new ApplicationContext();
  });

  describe('class Service injection', () => {
    const SERVICE_IDENTIFIER_1 = Symbol('test1');
    const SERVICE_IDENTIFIER_2 = Symbol('test2');
    const SERVICE_IDENTIFIER_3 = Symbol('test3');

    class Service1 {
      public method1 = () => 'Hello';
    }

    class Service2 {
      public method2 = () => 'World!';
    }

    class Service3 {
      constructor(private service1: Service1, private service2: Service2) {}

      public method3 = () =>
        `${this.service1.method1()}, ${this.service2.method2()}`;
    }

    describe('happy dependencies', () => {
      it('should return the Service that has been registered under the correct symbol', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
        );
        applicationContext.registerService<Service2>(
          SERVICE_IDENTIFIER_2,
          Service2,
        );

        const service1 = applicationContext.get<Service1>(SERVICE_IDENTIFIER_1);
        const service2 = applicationContext.get<Service2>(SERVICE_IDENTIFIER_2);

        assert.instanceOf(service1, Service1);
        assert.instanceOf(service2, Service2);
      });

      it('should return the same instance of the Service if singleton-ness is not specified', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
        );

        const serviceInstance1 = applicationContext.get<Service1>(
          SERVICE_IDENTIFIER_1,
        );
        const serviceInstance2 = applicationContext.get<Service1>(
          SERVICE_IDENTIFIER_1,
        );

        assert.instanceOf(serviceInstance1, Service1);
        assert.instanceOf(serviceInstance2, Service1);
        assert.equal(serviceInstance1, serviceInstance2);
      });

      it('should return the same instance of the Service if singleton', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
          {
            isSingleton: true,
          },
        );

        const serviceInstance1 = applicationContext.get<Service1>(
          SERVICE_IDENTIFIER_1,
        );
        const serviceInstance2 = applicationContext.get<Service1>(
          SERVICE_IDENTIFIER_1,
        );

        assert.instanceOf(serviceInstance1, Service1);
        assert.instanceOf(serviceInstance2, Service1);
        assert.equal(serviceInstance1, serviceInstance2);
      });

      it('should return different instances of the Service if not singleton', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
          {
            isSingleton: false,
          },
        );

        const serviceInstance1 = applicationContext.get<Service1>(
          SERVICE_IDENTIFIER_1,
        );
        const serviceInstance2 = applicationContext.get<Service1>(
          SERVICE_IDENTIFIER_1,
        );

        assert.instanceOf(serviceInstance1, Service1);
        assert.instanceOf(serviceInstance2, Service1);
        assert.notEqual(serviceInstance1, serviceInstance2);
      });

      it('should Inject any dependencies into the Service (added together)', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
        );
        applicationContext.registerService<Service2>(
          SERVICE_IDENTIFIER_2,
          Service2,
        );
        applicationContext
          .registerService<Service3>(SERVICE_IDENTIFIER_3, Service3)
          .addDependencies(SERVICE_IDENTIFIER_1, SERVICE_IDENTIFIER_2);

        const service3 = applicationContext.get<Service3>(SERVICE_IDENTIFIER_3);

        assert.instanceOf(service3, Service3);
        assert.equal(service3.method3(), 'Hello, World!');
      });

      it('should Inject any dependencies into the Service (added individually)', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
        );
        applicationContext.registerService<Service2>(
          SERVICE_IDENTIFIER_2,
          Service2,
        );
        applicationContext
          .registerService<Service3>(SERVICE_IDENTIFIER_3, Service3)
          .addDependency(SERVICE_IDENTIFIER_1, 0)
          .addDependency(SERVICE_IDENTIFIER_2, 1);

        const service3 = applicationContext.get<Service3>(SERVICE_IDENTIFIER_3);

        assert.instanceOf(service3, Service3);
        assert.equal(service3.method3(), 'Hello, World!');
      });
    });

    describe('sad dependencies', () => {
      it("should return null if trying to access a Service that hasn't been registers", () => {
        assert.throws(() => {
          applicationContext.get<Service1>(SERVICE_IDENTIFIER_1);
        });
      });

      it('should throw an error if getting a Service that has missing dependencies', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
        );
        // applicationContext.registerService<Service2>(SERVICE_IDENTIFIER_2, Service2); // oh no, not registered!
        applicationContext
          .registerService<Service3>(SERVICE_IDENTIFIER_3, Service3)
          .addDependency(SERVICE_IDENTIFIER_1, 0)
          .addDependency(SERVICE_IDENTIFIER_2, 1);

        assert.throws(() => {
          applicationContext.get<Service3>(SERVICE_IDENTIFIER_3);
        });
      });

      it('should throw an error if not registering enough dependencies (addDependency)', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
        );
        applicationContext.registerService<Service2>(
          SERVICE_IDENTIFIER_2,
          Service2,
        );
        applicationContext
          .registerService<Service3>(SERVICE_IDENTIFIER_3, Service3)
          .addDependency(SERVICE_IDENTIFIER_1, 0);
        // .addDependency(SERVICE_IDENTIFIER_2, 1); // oh no, only registered one of its 2 dependencies

        assert.throws(() => {
          applicationContext.get<Service3>(SERVICE_IDENTIFIER_3);
        });
      });

      it('should throw an error if not registering enough dependencies (addDependencies)', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
        );
        applicationContext.registerService<Service2>(
          SERVICE_IDENTIFIER_2,
          Service2,
        );

        assert.throws(() => {
          applicationContext
            .registerService<Service3>(SERVICE_IDENTIFIER_3, Service3)
            .addDependencies(SERVICE_IDENTIFIER_1); // oh no, only registered one of its 2 dependencies
        });
      });

      it('should throw an error if registering the same depenecency position', () => {
        applicationContext.registerService<Service1>(
          SERVICE_IDENTIFIER_1,
          Service1,
        );
        applicationContext.registerService<Service2>(
          SERVICE_IDENTIFIER_2,
          Service2,
        );

        assert.throws(() => {
          applicationContext
            .registerService<Service3>(SERVICE_IDENTIFIER_3, Service3)
            .addDependency(SERVICE_IDENTIFIER_1, 0)
            .addDependency(SERVICE_IDENTIFIER_2, 0); // oh no, we have already registered a dependecy here
        });
      });

      it('should throw an error if there is a circular dependency', () => {
        class ServiceA {
          constructor(serviceb: ServiceB) {
            return;
          }
        }

        class ServiceB {
          constructor(serviceb: ServiceC) {
            return;
          }
        }

        class ServiceC {
          constructor(serviceb: ServiceA) {
            return;
          }
        }

        applicationContext
          .registerService<ServiceA>(SERVICE_IDENTIFIER_1, ServiceA)
          .addDependencies(SERVICE_IDENTIFIER_2);
        applicationContext
          .registerService<ServiceB>(SERVICE_IDENTIFIER_2, ServiceB)
          .addDependencies(SERVICE_IDENTIFIER_3);
        applicationContext
          .registerService<ServiceC>(SERVICE_IDENTIFIER_3, ServiceC)
          .addDependencies(SERVICE_IDENTIFIER_1);

        assert.throws(() => {
          applicationContext.get<ServiceA>(SERVICE_IDENTIFIER_1);
        });
      });
    });

    describe('overriding', () => {
      it('should allow you override a Service', () => {
        const SERVICE_IDENTIFIER = Symbol('ServiceIdentifier');

        interface IService {
          stringify: () => string;
        }

        class ServiceA implements IService {
          public stringify = () => 'Service a';
        }

        class ServiceB implements IService {
          public stringify = () => 'Service b';
        }

        applicationContext.registerService<IService>(
          SERVICE_IDENTIFIER,
          ServiceA,
        );
        applicationContext.registerService<IService>(
          SERVICE_IDENTIFIER,
          ServiceB,
        );

        const Service = applicationContext.get<IService>(SERVICE_IDENTIFIER);

        assert.instanceOf(Service, ServiceB);
        assert.equal(Service.stringify(), 'Service b');
      });
    });
  });

  describe('function Service injection', () => {
    it('should allow you to register a factory', () => {
      const FUNC_SERVICE = Symbol('FuncService');

      interface IService {
        method1: () => string;
      }

      const factory = () => {
        return {
          method1: () => 'Hello',
        };
      };
      applicationContext.registerFactory<IService>(FUNC_SERVICE, factory);

      const Service = applicationContext.get<IService>(FUNC_SERVICE);

      assert.equal(Service.method1(), 'Hello');
    });

    it('should allow you to Inject a function-Service into a class Service, and vice versa', () => {
      const HELLO_SERVICE = Symbol('HelloService');
      const SPACE_SERVICE = Symbol('SpaceService');
      const WORLD_SERVICE = Symbol('WorldService');

      interface IHelloService {
        hello: () => string;
      }

      interface IWorldService {
        world: () => string;
      }

      const helloServiceFactory = () => {
        return {
          hello: () => 'Hello',
        };
      };

      class SpaceService {
        constructor(private funcService1: IHelloService) {}

        public space = () => this.funcService1.hello() + ', ';
      }

      const worldServiceFactory = (spaceService: SpaceService) => {
        return {
          world: () => spaceService.space() + 'World!',
        };
      };

      applicationContext.registerFactory<IHelloService>(
        HELLO_SERVICE,
        helloServiceFactory,
      );
      applicationContext
        .registerService<SpaceService>(SPACE_SERVICE, SpaceService)
        .addDependencies(HELLO_SERVICE);
      applicationContext
        .registerFactory<IWorldService>(WORLD_SERVICE, worldServiceFactory)
        .addDependencies(SPACE_SERVICE);

      const Service = applicationContext.get<IWorldService>(WORLD_SERVICE);

      assert.equal(Service.world(), 'Hello, World!');
    });
  });

  describe('constant injection', () => {
    const CONSTANT_1 = Symbol('Constant1');
    const CONSTANT_2 = Symbol('Constant2');
    const CONSTANT_3 = Symbol('Constant3');

    beforeEach(() => {
      applicationContext.registerConstant<number>(CONSTANT_1, 5);
      applicationContext.registerConstant<string>(CONSTANT_2, 'Hello');
    });

    it('should return the constant', () => {
      const constant1 = applicationContext.get<number>(CONSTANT_1);
      const constant2 = applicationContext.get<string>(CONSTANT_2);

      assert.equal(constant1, 5);
      assert.equal(constant2, 'Hello');
    });

    it("should throw error if constant isn't defined", () => {
      assert.throws(() => {
        applicationContext.get<number>(CONSTANT_3);
      });
    });

    it('should Inject constants into services', () => {
      const SERVICE_1 = Symbol('Service1');

      class Service1 {
        constructor(private constant1: number, private constant2: string) {}

        public combineConstants = () => `${this.constant2} ${this.constant1}`;
      }

      applicationContext
        .registerService<Service1>(SERVICE_1, Service1)
        .addDependencies(CONSTANT_1, CONSTANT_2);

      const Service = applicationContext.get<Service1>(SERVICE_1);

      assert.equal(Service.combineConstants(), 'Hello 5');
    });
  });
});
