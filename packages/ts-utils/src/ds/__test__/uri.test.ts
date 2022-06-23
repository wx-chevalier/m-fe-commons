import { encodeUri, getUrlParam, setOssResize } from '../uri';

describe('getUrlParam', () => {
  // it('setOssResize', () => {
  //   const uri =
  //     'https://ufc-marketing.oss-cn-shanghai.aliyuncs.com/%E5%AE%98%E7%BD%91/%E5%9B%BE%E7%89%87/%E8%A1%8C%E4%B8%9A%E6%A1%88%E4%BE%8B/b-%E5%B7%A5%E4%B8%9A%E7%94%B5%E5%AD%90.jpeg';
  //   console.log(
  //     setOssResize(uri, 300, {
  //       watermark: {
  //         type: 'text',
  //         base64Text: '5LyY6IGU5pm66YCg',
  //         opacity: 10,
  //         seOpacity: 100,
  //         color: 'F0F0F0',
  //         fontSize: 10,
  //       },
  //     }),
  //   );
  // });
  // it('encodeUri', () => {
  //   // const testUri = 'https://a.com/我';
  //   const testUri1 =
  //     'http://username:password@www.example.com:80/我/path/to/file.php#bb?foo=316&bar=this+has+spaces#anchor';
  //   const testUri2 =
  //     'http://username:password@www.example.com:80/我/path/to/file.php?foo=316&bar=this+has+spaces#anchor';
  //   console.log(encodeUri(testUri1, true));
  //   console.log(encodeUri(testUri2, true));
  //   console.log(encodeUri(encodeUri(testUri1)));
  //   console.log(encodeUri(encodeUri(testUri2)));
  // });
  it('getUrlParam', () => {
    console.log(
      getUrlParam(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token1',
      ),
    ); // 1
    console.log(
      getUrlParam(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token2',
      ),
    ); // 2
    console.log(
      getUrlParam(
        'http://0.0.0.0:8080/?token1=1&token2=3#/home/dashboard/0?token2=2',
        'token2',
      ),
    ); // 3
    console.log(
      getUrlParam(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token3',
      ),
    );
  });
});
