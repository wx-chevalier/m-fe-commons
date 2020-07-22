import { getParamFromSearch } from '../uri';

describe('getParamFromSearch', () => {
  it('getParamFromSearch', () => {
    console.log(
      getParamFromSearch(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token1',
      ),
    );

    console.log(
      getParamFromSearch(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token2',
      ),
    );

    console.log(
      getParamFromSearch(
        'http://0.0.0.0:8080/?token1=1#/home/dashboard/0?token2=2',
        'token3',
      ),
    );
  });
});
