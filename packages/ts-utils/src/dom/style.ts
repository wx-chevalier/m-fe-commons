import { hash } from '../ds';
import { raf } from '../func';
import { element } from './element/utils';

let stylesheet: CSSGroupingRule | StyleSheet | null;
let active = 0;
let currentRules = {};

export function createRule(
  node: Element & ElementCSSInlineStyle,
  a: number,
  b: number,
  duration: number,
  delay: number,
  ease: (t: number) => number,
  fn: (t: number, u: number) => string,
  uid = 0,
) {
  const step = 16.666 / duration;
  let keyframes = '{\n';

  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
  }

  const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
  const name = `__ueact_${hash(rule)}_${uid}`;

  if (!currentRules[name]) {
    if (!stylesheet) {
      const style = element('style');
      document.head.appendChild(style);
      stylesheet = style.sheet;
    }

    currentRules[name] = true;

    if (stylesheet && stylesheet instanceof CSSGroupingRule) {
      stylesheet.insertRule(
        `@keyframes ${name} ${rule}`,
        stylesheet.cssRules.length,
      );
    }
  }

  const animation = node.style.animation || '';
  node.style.animation = `${
    animation ? `${animation}, ` : ``
  }${name} ${duration}ms linear ${delay}ms 1 both`;

  active += 1;
  return name;
}

export function deleteRule(
  node: Element & ElementCSSInlineStyle,
  name?: string,
) {
  node.style.animation = (node.style.animation || '')
    .split(', ')
    .filter(
      name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1, // remove all Svelte animations
    )
    .join(', ');

  if (name && !--active) clearRules();
}

export function clearRules() {
  raf(() => {
    if (active) return;
    if (stylesheet && stylesheet instanceof CSSGroupingRule) {
      let i = stylesheet.cssRules.length;
      while (i--) stylesheet.deleteRule(i);
      currentRules = {};
    }
  });
}

export function hasClass(el: HTMLElement, str: string) {
  let result = false;

  const value = ` ${str} `;
  const clean = ` ${el.className} `.replace(/[\n\t]/g, ' ');

  if (clean.indexOf(value) > -1) {
    result = true;
  }

  return result;
}

export const css = (styleBlock: string) => {
  const className = hash(styleBlock);

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .${className} {
      ${styleBlock}
    }
  `;

  document.head.appendChild(styleEl);
  return className;
};
