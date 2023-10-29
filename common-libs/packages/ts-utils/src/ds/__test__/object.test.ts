import { assignInConstructor } from '../object';

class AC {
  acExternal: any;

  acInner? = 'acInner';

  constructor(data: Partial<AC> = {}) {
    assignInConstructor(this, data);
  }
}

class A {
  a = 1;

  ac: AC;

  constructor(data: Partial<A>) {
    assignInConstructor(this, data);

    this.ac = new AC(this.ac);
  }
}

class B extends A {
  b = 3;

  bc = { bc: 1 };

  constructor(data: Partial<B> = {}) {
    super(data);

    assignInConstructor(this, data);
  }
}

describe('object', () => {
  it('assignInConstructor', async done => {
    console.log(new B({ ac: { acExternal: 22 }, b: undefined, bc: { bc: 2 } }));

    done();
  });
});
