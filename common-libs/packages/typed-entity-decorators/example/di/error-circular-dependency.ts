import { applicationContext, Service, Inject } from '../../src';

@Service('service1')
class Service1 {
  constructor(@Inject('service2') service2: Service2) {
    return;
  }
}

@Service('service2')
class Service2 {
  constructor(@Inject('service3') service3: Service3) {
    return;
  }
}

@Service('service3')
class Service3 {
  constructor(@Inject('service1') service1: Service1) {
    return;
  }
}

applicationContext.get<Service3>('service1');
