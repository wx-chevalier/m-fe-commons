import { getUrlParam } from '../uri';

describe('getUrlParam', () => {
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
