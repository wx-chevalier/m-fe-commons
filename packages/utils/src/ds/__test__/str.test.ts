import { parseJson } from '../str';

describe('str', () => {
  it('parseJson', () => {
    console.log(parseJson(undefined, undefined));
    console.log(parseJson(null, undefined));
    console.log(parseJson('a', 'a'));
    console.log(parseJson('{"a":1}', {}));
  });
});
