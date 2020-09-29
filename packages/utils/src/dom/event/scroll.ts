/** 滚动相关处理 */

/**
 * 为某些元素添加拖拽滚动的能力
 * @param className 类名选择器
 */
export function enableDragScroll(className: string) {
  const _window = window;
  const _document = document;
  const mousemove = 'mousemove';
  const mouseup = 'mouseup';
  const mousedown = 'mousedown';
  const EventListener = 'EventListener';
  const addEventListener = 'add' + EventListener;
  const removeEventListener = 'remove' + EventListener;
  let newScrollX, newScrollY;

  let dragged: any[] = [];
  const reset = (i?: number, el?: any) => {
    for (i = 0; i < dragged.length; ) {
      el = dragged[i++];
      el = el.container || el;
      el[removeEventListener](mousedown, el.md, 0);
      _window[removeEventListener](mouseup, el.mu, 0);
      _window[removeEventListener](mousemove, el.mm, 0);
    }

    // cloning into array since HTMLCollection is updated dynamically
    dragged = [].slice.call(_document.getElementsByClassName(className));

    for (i = 0; i < dragged.length; ) {
      ((
        el,
        lastClientX: any = 0,
        lastClientY: any = 0,
        pushed: any = 0,
        scroller: any = 0,
        cont: any = 0,
      ) => {
        (cont = el.container || el)[addEventListener](
          mousedown,
          (cont.md = (e: any) => {
            if (
              !el.hasAttribute('nochilddrag') ||
              _document.elementFromPoint(e.pageX, e.pageY) == cont
            ) {
              pushed = 1;
              lastClientX = e.clientX;
              lastClientY = e.clientY;

              e.preventDefault();
            }
          }),
          0,
        );

        _window[addEventListener](
          mouseup,
          (cont.mu = () => {
            pushed = 0;
          }),
          0,
        );

        _window[addEventListener](
          mousemove,
          (cont.mm = (e: any) => {
            if (pushed) {
              (scroller = el.scroller || el).scrollLeft -= newScrollX =
                -lastClientX + (lastClientX = e.clientX);

              console.log((scroller = el.scroller || el).scrollLeft);
              scroller.scrollTop -= newScrollY =
                -lastClientY + (lastClientY = e.clientY);
              if (el == _document.body) {
                (scroller = _document.documentElement).scrollLeft -= newScrollX;
                scroller.scrollTop -= newScrollY;
              }
            }
          }),
          0,
        );
      })(dragged[i++]);
    }
  };

  if (_document.readyState == 'complete') {
    reset();
  } else {
    _window[addEventListener]('load', reset, 0);
  }
}
