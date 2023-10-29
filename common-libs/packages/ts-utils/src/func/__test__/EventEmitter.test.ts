import { EventEmitter } from '../EventEmitter';

describe('', () => {
  it('', done => {
    class A extends EventEmitter<'A'> {}

    const a = new A();

    a.on('A', () => {
      console.log(1);
      done();
    });
    a.emit('A');
  });
});
