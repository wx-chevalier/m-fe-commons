/* eslint-disable @typescript-eslint/prefer-for-of */
/* global document */
/* global window */
class Element {
  el: HTMLElement;
  _data: Record<string, any>;

  constructor(tag: string | HTMLElement, className = '') {
    if (typeof tag === 'string') {
      this.el = document.createElement(tag);
      this.el.className = className;
    } else {
      this.el = tag;
    }

    this._data = {};
  }

  data(key: string, value: any) {
    if (value !== undefined) {
      this.data[key] = value;
      return this;
    }
    return this.data[key];
  }

  on(eventNames: string, handler: Function) {
    const [fen, ...oen] = eventNames.split('.');
    let eventName = fen;

    if (
      eventName === 'mousewheel' &&
      /Firefox/i.test(window.navigator.userAgent)
    ) {
      eventName = 'DOMMouseScroll';
    }

    this.el.addEventListener(eventName, (evt: any) => {
      handler(evt);

      for (let i = 0; i < oen.length; i += 1) {
        const k = oen[i];

        if (k === 'left' && evt.button !== 0) {
          return;
        }

        if (k === 'right' && evt.button !== 2) {
          return;
        }

        if (k === 'stop') {
          evt.stopPropagation();
        }
      }
    });
    return this;
  }

  offset(value: number) {
    if (value !== undefined) {
      Object.keys(value).forEach(k => {
        this.css(k, `${value[k]}px`);
      });
      return this;
    }
    const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = this.el;
    return {
      top: offsetTop,
      left: offsetLeft,
      height: offsetHeight,
      width: offsetWidth,
    };
  }

  scroll(v: { top: number; left: number }) {
    const { el } = this;
    if (v !== undefined) {
      if (v.left !== undefined) {
        el.scrollLeft = v.left;
      }
      if (v.top !== undefined) {
        el.scrollTop = v.top;
      }
    }
    return { left: el.scrollLeft, top: el.scrollTop };
  }

  box() {
    return this.el.getBoundingClientRect();
  }

  parent() {
    return new Element(this.el.parentNode as HTMLElement);
  }

  children(...eles: HTMLElement[]) {
    if (arguments.length === 0) {
      return this.el.childNodes;
    }
    eles.forEach(ele => this.child(ele));
    return this;
  }

  removeChild(el: HTMLElement) {
    this.el.removeChild(el);
  }

  /*
  first() {
    return this.el.firstChild;
  }

  last() {
    return this.el.lastChild;
  }

  remove(ele) {
    return this.el.removeChild(ele);
  }

  prepend(ele) {
    const { el } = this;
    if (el.children.length > 0) {
      el.insertBefore(ele, el.firstChild);
    } else {
      el.appendChild(ele);
    }
    return this;
  }

  prev() {
    return this.el.previousSibling;
  }

  next() {
    return this.el.nextSibling;
  }
  */

  child(arg: string | HTMLElement) {
    let ele: HTMLElement;

    if (typeof arg === 'string') {
      ele = (document.createTextNode(arg) as unknown) as HTMLElement;
    } else if (arg instanceof Element) {
      ele = arg.el;
    } else {
      ele = arg;
    }

    this.el.appendChild(ele);
    return this;
  }

  contains(ele: HTMLElement) {
    return this.el.contains(ele);
  }

  className(v: string) {
    if (v !== undefined) {
      this.el.className = v;
      return this;
    }
    return this.el.className;
  }

  addClass(name: string) {
    this.el.classList.add(name);
    return this;
  }

  hasClass(name: string) {
    return this.el.classList.contains(name);
  }

  removeClass(name: string) {
    this.el.classList.remove(name);
    return this;
  }

  toggle(cls = 'active') {
    return this.toggleClass(cls);
  }

  toggleClass(name: string) {
    return this.el.classList.toggle(name);
  }

  active(flag = true, cls = 'active') {
    if (flag) this.addClass(cls);
    else this.removeClass(cls);
    return this;
  }

  checked(flag = true) {
    this.active(flag, 'checked');
    return this;
  }

  disabled(flag = true) {
    if (flag) this.addClass('disabled');
    else this.removeClass('disabled');
    return this;
  }

  // key, value
  // key
  // {k, v}...
  attr(key: string, value: string) {
    if (value !== undefined) {
      this.el.setAttribute(key, value);
    } else {
      if (typeof key === 'string') {
        return this.el.getAttribute(key);
      }
      Object.keys(key).forEach(k => {
        this.el.setAttribute(k, key[k]);
      });
    }
    return this;
  }

  removeAttr(key: string) {
    this.el.removeAttribute(key);
    return this;
  }

  html(content: string) {
    if (content !== undefined) {
      this.el.innerHTML = content;
      return this;
    }
    return this.el.innerHTML;
  }

  val(v: string) {
    if (v !== undefined) {
      (this.el as HTMLInputElement).value = v;
      return this;
    }
    return (this.el as HTMLInputElement).value;
  }

  focus() {
    this.el.focus();
  }

  cssRemoveKeys(...keys: string[]) {
    keys.forEach(k => this.el.style.removeProperty(k));
    return this;
  }

  // css( propertyName )
  // css( propertyName, value )
  // css( properties )
  css(name: string, value: string) {
    if (value === undefined && typeof name !== 'string') {
      Object.keys(name).forEach(k => {
        this.el.style[k] = name[k];
      });
      return this;
    }
    if (value !== undefined) {
      this.el.style[name] = value;
      return this;
    }
    return this.el.style[name];
  }

  computedStyle() {
    return window.getComputedStyle(this.el, null);
  }

  show() {
    this.css('display', 'block');
    return this;
  }

  hide() {
    this.css('display', 'none');
    return this;
  }
}

const h = (tag: string, className = '') => new Element(tag, className);

export { Element, h };
