import MobileDetect from 'mobile-detect';

/** 是否为移动端 */
export function isMobile(_ua?: string) {
  let ua = _ua;
  if (typeof window !== undefined && !ua) {
    ua = window.navigator.userAgent;
  }

  const md = new MobileDetect(window.navigator.userAgent);

  return !!md.mobile();
}
