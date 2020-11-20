import { createDeepProxy, isDeepChanged } from 'proxy-compare';
import { useEffect, useMemo, useRef } from 'react';

import { getVersion, snapshot, subscribe } from '../vanilla/proxy';

import { createMutableSource, useMutableSource } from './useMutableSource';

type MutableSource = any;
const mutableSourceCache = new WeakMap<object, MutableSource>();

const getMutableSource = (p: any): MutableSource => {
  if (!mutableSourceCache.has(p)) {
    mutableSourceCache.set(p, createMutableSource(p, getVersion));
  }
  return mutableSourceCache.get(p) as MutableSource;
};

/** 针对 React Hooks 场景进行优化 */
export const useProxy = <T extends object>(p: T): T => {
  const affected = new WeakMap();
  const lastAffected = useRef<WeakMap<object, unknown>>();

  useEffect(() => {
    lastAffected.current = affected;
  });

  const getChangedSnapshot = useMemo(() => {
    let prevSnapshot: any = null;
    const deepChangedCache = new WeakMap();

    return (p: any) => {
      const nextSnapshot = snapshot(p);
      try {
        // 判断是否发生改变，实际上这里使用的是 lastAffected
        if (
          prevSnapshot !== null &&
          lastAffected.current &&
          !isDeepChanged(
            prevSnapshot,
            nextSnapshot,
            lastAffected.current,
            deepChangedCache,
          )
        ) {
          // not changed
          return prevSnapshot;
        }
      } catch (e) {
        // ignore and return new nextSnapshot
      }
      return (prevSnapshot = nextSnapshot);
    };
  }, []);

  // 将频繁变化的值以 React use-subscription 封装
  // The value returned by this hook reflects the input's current value.
  // Our component will automatically be re-rendered when that value changes.
  const currSnapshot = useMutableSource(
    getMutableSource(p),
    getChangedSnapshot,
    subscribe,
  );

  // per-hook proxyCache
  const proxyCache = useMemo(() => new WeakMap(), []);

  return createDeepProxy(currSnapshot, affected, proxyCache);
};
