/** 加载脚本 */
export function loadScript(src: string, cb: () => void) {
  // 创建一个script元素
  const el: any = document.createElement('script');
  let loaded = false;

  // 设置加载完成的回调事件
  el.onload = () => {
    // 防止重复加载
    if (
      (el.readyState &&
        el.readyState !== 'complete' &&
        el.readyState !== 'loaded') ||
      loaded
    ) {
      return false;
    }
    // 加载完成后将该脚本的onload设置为null
    el.onload = el.onreadystatechange = null;
    loaded = true;
    cb && cb();
  };

  el.async = true;
  el.src = src;

  const body = document.getElementsByTagName('body')[0];
  body.appendChild(el);
}
