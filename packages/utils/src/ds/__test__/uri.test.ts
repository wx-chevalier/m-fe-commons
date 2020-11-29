import { encodeUri, getUrlParam } from '../uri';

describe('getUrlParam', () => {
  it('encodeUri', () => {
    // const testUri = 'https://a.com/我';
    const testUri1 =
      'http://username:password@www.example.com:80/我/path/to/file.php#bb?foo=316&bar=this+has+spaces#anchor';

    const testUri2 =
      'http://username:password@www.example.com:80/我/path/to/file.php?foo=316&bar=this+has+spaces#anchor';

    console.log(encodeUri(testUri1, true));
    console.log(encodeUri(testUri2, true));
    console.log(encodeUri(encodeUri(testUri1)));
    console.log(encodeUri(encodeUri(testUri2)));
  });

  // it('getUrlParam', () => {
  //   console.log(
  //     getUrlParam(
  //       'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
  //       'token1',
  //     ),
  //   );

  //   console.log(
  //     getUrlParam(
  //       'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
  //       'token2',
  //     ),
  //   );

  //   console.log(
  //     getUrlParam(
  //       'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
  //       'token3',
  //     ),
  //   );
  // });
});
