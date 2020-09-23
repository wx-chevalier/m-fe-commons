import { encodeUri, getUrlParam } from '../uri';

describe('getUrlParam', () => {
  it('encodeUri', () => {
    const testUri = 'https://a.com/我';

    console.log(encodeUri(testUri));
    console.log(encodeUri(encodeUri(testUri)));
  });

  it('getUrlParam', () => {
    console.log(
      getUrlParam(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token1',
      ),
    );

    console.log(
      getUrlParam(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token2',
      ),
    );

    console.log(
      getUrlParam(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token3',
      ),
    );
  });
});
