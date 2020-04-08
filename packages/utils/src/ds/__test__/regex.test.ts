import { isLanIp } from '../regex';

describe('isLanIp', () => {
  it('isLanIp true', () => {
    expect(isLanIp('192.168.1.1')).toBeTruthy();
  });

  it('isLanIp false', () => {
    expect(isLanIp('158.168.1.1')).not.toBeTruthy();
  });
});

describe('isLanIp2', () => {
  it('isLanIp2 true', () => {
    expect(isLanIp('192.168.1.1')).toBeTruthy();
  });

  it('isLanIp2 false', () => {
    expect(isLanIp('158.168.1.1')).not.toBeTruthy();
  });
});
