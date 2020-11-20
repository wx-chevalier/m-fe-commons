import { proxy, subscribe } from '../proxy';

describe('proxy', () => {
  it('proxy listerner cb', done => {
    const proxiedObj = proxy({ a: 1 });

    subscribe(proxiedObj, () => {
      console.log(proxiedObj);
      done();
    });

    proxiedObj.a = 2;
  });
});
