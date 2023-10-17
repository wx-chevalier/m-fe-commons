import { isLanIp } from '../ip';

describe('isLanIp', () => {
  it('isLanIp true', () => {
    expect(isLanIp('192.168.1.1')).toBeTruthy();
  });

  it('isLanIp true', () => {
    expect(isLanIp('http://192.168.1.1/11')).toBeTruthy();
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

describe('isIp', () => {
  it('ipIPV4 true', () => {
    expect(isLanIp('192.168.1.1')).toBeTruthy();
  });

  it('ipIPV4 false', () => {
    expect(isLanIp('192.169.1.2 192.168.1.,a1')).toBeFalsy();
  });
});
