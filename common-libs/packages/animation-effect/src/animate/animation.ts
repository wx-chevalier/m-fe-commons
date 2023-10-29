import { createRule, deleteRule, loop, noop } from '@m-fe/utils';

import { linear } from './easing';

export interface AnimationConfig {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  css?: (t: number, u: number) => string;
  tick?: (t: number, u: number) => void;
}

// todo: documentation says it is DOMRect, but in IE it would be ClientRect
type PositionRect = DOMRect | ClientRect;

type AnimationFn = (
  node: Element,
  { from, to }: { from: PositionRect; to: PositionRect },
  params: any,
) => AnimationConfig;

export function createAnimation(
  node: Element & ElementCSSInlineStyle,
  from: PositionRect,
  fn: AnimationFn,
  params: object,
) {
  if (!from) return noop;

  const to = node.getBoundingClientRect();
  if (
    from.left === to.left &&
    from.right === to.right &&
    from.top === to.top &&
    from.bottom === to.bottom
  )
    return noop;

  const {
    delay = 0,
    duration = 300,
    easing = linear,
    // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
    start: startTime = now() + delay,
    // @ts-ignore todo:
    end = startTime + duration,
    tick = noop,
    css,
  } = fn(node, { from, to }, params);

  let running = true;
  let started = false;
  let name: string;

  function start() {
    if (css) {
      name = createRule(node, 0, 1, duration, delay, easing, css);
    }

    if (!delay) {
      started = true;
    }
  }

  function stop() {
    if (css) deleteRule(node, name);
    running = false;
  }

  loop(now => {
    if (!started && now >= startTime) {
      started = true;
    }

    if (started && now >= end) {
      tick(1, 0);
      stop();
    }

    if (!running) {
      return false;
    }

    if (started) {
      const p = now - startTime;
      const t = 0 + 1 * easing(p / duration);
      tick(t, 1 - t);
    }

    return true;
  });

  start();

  tick(0, 1);

  return stop;
}

export function fixPosition(node: Element & ElementCSSInlineStyle) {
  const style = getComputedStyle(node);

  if (style.position !== 'absolute' && style.position !== 'fixed') {
    const { width, height } = style;
    const a = node.getBoundingClientRect();
    node.style.position = 'absolute';
    node.style.width = width;
    node.style.height = height;
    addTransform(node, a);
  }
}

export function addTransform(
  node: Element & ElementCSSInlineStyle,
  a: PositionRect,
) {
  const b = node.getBoundingClientRect();

  if (a.left !== b.left || a.top !== b.top) {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;

    node.style.transform = `${transform} translate(${a.left -
      b.left}px, ${a.top - b.top}px)`;
  }
}
