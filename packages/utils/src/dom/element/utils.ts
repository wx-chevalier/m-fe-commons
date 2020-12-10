const regex = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;

/** Query element with flexible conditions */
export function query(qry: string, ctx: Element | Document) {
  let test;
  let match;

  if ((test = regex.exec(qry))) {
    if ((match = test[3])) {
      return ctx.getElementsByClassName(match);
    }

    if ((match = test[2])) {
      return ctx.getElementsByTagName(match);
    }

    if ((match = test[1])) {
      return document.getElementById(match);
    }
  }

  return ctx.querySelectorAll(qry);
}

/** 创建元素 */
export function element<K extends keyof HTMLElementTagNameMap>(name: K) {
  return document.createElement<K>(name);
}

export function svgElement<K extends keyof SVGElementTagNameMap>(
  name: K,
): SVGElement {
  return document.createElementNS<K>('http://www.w3.org/2000/svg', name);
}

export function text(data: string) {
  return document.createTextNode(data);
}

export function space() {
  return text(' ');
}

export function empty() {
  return text('');
}

export function attr(node: Element, attribute: string, value?: string) {
  if (value == null) node.removeAttribute(attribute);
  else node.setAttribute(attribute, value);
}

export function setAttr(
  node: Element & ElementCSSInlineStyle,
  attributes: { [x: string]: string },
) {
  for (const key in attributes) {
    if (key === 'style') {
      node.style.cssText = attributes[key];
    } else if (key in node) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
}

export function setCustomElementData(
  node: Element & ElementCSSInlineStyle,
  prop: string,
  value: string,
) {
  if (prop in node) {
    node[prop] = value;
  } else {
    attr(node, prop, value);
  }
}

export function xlinkAttr(
  node: Element & ElementCSSInlineStyle,
  prop: string,
  value: string,
) {
  node.setAttributeNS('http://www.w3.org/1999/xlink', prop, value);
}

export function append(target: Node, node: Node) {
  target.appendChild(node);
}

export function insert(target: Node, node: Node, anchor?: Node) {
  target.insertBefore(node, anchor || null);
}

export function children(element: Element) {
  return Array.from(element.childNodes);
}

export function detach(node: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

/** 判断元素是否可见 */
export function isElementVisible(elem: HTMLElement) {
  if (!(elem instanceof Element))
    throw Error('DomUtil: elem is not an element.');
  const style = getComputedStyle(elem);
  if (style.display === 'none') return false;
  if (style.visibility !== 'visible') return false;
  if (style.opacity < '0.1') return false;
  if (
    elem.offsetWidth +
      elem.offsetHeight +
      elem.getBoundingClientRect().height +
      elem.getBoundingClientRect().width ===
    0
  ) {
    return false;
  }
  const elemCenter = {
    x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
    y: elem.getBoundingClientRect().top + elem.offsetHeight / 2,
  };
  if (elemCenter.x < 0) return false;
  if (
    elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)
  )
    return false;
  if (elemCenter.y < 0) return false;
  if (
    elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)
  )
    return false;
  let pointContainer: any = document.elementFromPoint(
    elemCenter.x,
    elemCenter.y,
  );
  do {
    if (pointContainer === elem) return true;
  } while ((pointContainer = pointContainer.parentNode));
  return false;
}
