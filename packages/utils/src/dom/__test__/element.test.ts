import { element } from '../element/utils';

describe('create', () => {
  it('element', () => {
    const $a = element('a');
    expect($a.tagName).toEqual('A');
  });
});
