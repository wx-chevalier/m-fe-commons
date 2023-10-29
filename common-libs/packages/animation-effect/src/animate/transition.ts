/* eslint-disable @typescript-eslint/camelcase */
/* tslint-disable variable-name */
import { isFunction, assign } from '@m-fe/utils';

import { cubicInOut, cubicOut } from './easing';

export interface TransitionConfig {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  css?: (t: number, u: number) => string;
  tick?: (t: number, u: number) => void;
}

interface FadeParams {
  delay: number;
  duration: number;
}

export function fade(
  node: Element,
  { delay = 0, duration = 400 }: FadeParams,
): TransitionConfig | null {
  const style = getComputedStyle(node);

  if (!style) {
    return null;
  }

  const o = +(style.opacity || 0);

  return {
    delay,
    duration,
    css: t => `opacity: ${t * o}`,
  };
}

interface FlyParams {
  delay: number;
  duration: number;
  easing: (t: number) => number;
  x: number;
  y: number;
  opacity: number;
}

export function fly(
  node: Element,
  {
    delay = 0,
    duration = 400,
    easing = cubicOut,
    x = 0,
    y = 0,
    opacity = 0,
  }: FlyParams,
): TransitionConfig {
  const style = getComputedStyle(node);
  const targetOpacity = +(style.opacity || 0);
  const transform = style.transform === 'none' ? '' : style.transform;

  const od = targetOpacity * (1 - opacity);

  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${targetOpacity - od * u}`,
  };
}

interface SlideParams {
  delay: number;
  duration: number;
  easing: (t: number) => number;
}

export function slide(
  node: Element,
  { delay = 0, duration = 400, easing = cubicOut }: SlideParams,
): TransitionConfig {
  const style = getComputedStyle(node);
  const opacity = +(style.opacity || 0);
  const height = parseFloat(style.height || '');
  const paddingTop = parseFloat(style.paddingTop || '');
  const paddingBottom = parseFloat(style.paddingBottom || '');
  const marginTop = parseFloat(style.marginTop || '');
  const marginBottom = parseFloat(style.marginBottom || '');
  const borderTopWidth = parseFloat(style.borderTopWidth || '');
  const borderBottomWidth = parseFloat(style.borderBottomWidth || '');

  return {
    delay,
    duration,
    easing,
    css: t =>
      `overflow: hidden;` +
      `opacity: ${Math.min(t * 20, 1) * opacity};` +
      `height: ${t * height}px;` +
      `padding-top: ${t * paddingTop}px;` +
      `padding-bottom: ${t * paddingBottom}px;` +
      `margin-top: ${t * marginTop}px;` +
      `margin-bottom: ${t * marginBottom}px;` +
      `border-top-width: ${t * borderTopWidth}px;` +
      `border-bottom-width: ${t * borderBottomWidth}px;`,
  };
}

interface ScaleParams {
  delay: number;
  duration: number;
  easing: (t: number) => number;
  start: number;
  opacity: number;
}

export function scale(
  node: Element,
  {
    delay = 0,
    duration = 400,
    easing = cubicOut,
    start = 0,
    opacity = 0,
  }: ScaleParams,
): TransitionConfig {
  const style = getComputedStyle(node);
  const targetOpacity = +(style.opacity || 0);
  const transform = style.transform === 'none' ? '' : style.transform;

  const sd = 1 - start;
  const od = targetOpacity * (1 - opacity);

  return {
    delay,
    duration,
    easing,
    css: (_t, u) => `
			transform: ${transform} scale(${1 - sd * u});
			opacity: ${targetOpacity - od * u}
		`,
  };
}

interface DrawParams {
  delay: number;
  speed: number;
  duration: number | ((len: number) => number);
  easing: (t: number) => number;
}

export function draw(
  node: SVGElement & { getTotalLength(): number },
  { delay = 0, speed, duration, easing = cubicInOut }: DrawParams,
): TransitionConfig {
  const len = node.getTotalLength();

  if (duration === undefined) {
    if (speed === undefined) {
      duration = 800;
    } else {
      duration = len / speed;
    }
  } else if (typeof duration === 'function') {
    duration = duration(len);
  }

  return {
    delay,
    duration,
    easing,
    css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`,
  };
}

interface CrossfadeParams {
  delay: number;
  duration: number | ((len: number) => number);
  easing: (t: number) => number;
}

type ClientRectMap = Map<any, { rect: ClientRect }>;

export function crossfade({
  fallback,
  ...defaults
}: CrossfadeParams & {
  fallback: (
    node: Element,
    params: CrossfadeParams,
    intro: boolean,
  ) => TransitionConfig;
}) {
  const toReceive: ClientRectMap = new Map();
  const toSend: ClientRectMap = new Map();

  function crossfade(
    from: ClientRect,
    node: Element,
    params: CrossfadeParams,
  ): TransitionConfig {
    const {
      delay = 0,
      duration = (d: number) => Math.sqrt(d) * 30,
      easing = cubicOut,
    } = assign(assign({}, defaults), params);

    const to = node.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const dw = from.width / to.width;
    const dh = from.height / to.height;
    const d = Math.sqrt(dx * dx + dy * dy);

    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;
    const opacity = +(style.opacity || '');

    return {
      delay,
      duration: isFunction(duration) ? (duration as Function)(d) : duration,
      easing,
      css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t +
        (1 - t) * dw}, ${t + (1 - t) * dh});
			`,
    };
  }

  function transition(
    items: ClientRectMap,
    counterparts: ClientRectMap,
    intro: boolean,
  ) {
    return (node: Element, params: CrossfadeParams & { key: any }) => {
      items.set(params.key, {
        rect: node.getBoundingClientRect(),
      });

      return () => {
        if (counterparts.has(params.key)) {
          const { rect } = counterparts.get(params.key)!;
          counterparts.delete(params.key);

          return crossfade(rect, node, params);
        }

        // if the node is disappearing altogether
        // (i.e. wasn't claimed by the other list)
        // then we need to supply an outro
        items.delete(params.key);
        return fallback && fallback(node, params, intro);
      };
    };
  }

  return [
    transition(toSend, toReceive, false),
    transition(toReceive, toSend, true),
  ];
}
