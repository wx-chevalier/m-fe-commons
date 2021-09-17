import { escapeStringBugs } from '../str';

describe('str', () => {
  // it('parseJson', () => {
  //   console.log(parseJson(undefined, undefined));
  //   console.log(parseJson(null, undefined));
  //   console.log(parseJson('a', 'a'));
  //   console.log(parseJson('{"a":1}', {}));
  //   console.log(parseJson('false', true));
  // });

  it('escapeStringBugs', () => {
    console.log(escapeStringBugs('1# 1'));
  });
});
