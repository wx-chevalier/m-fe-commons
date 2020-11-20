import { useMemo } from 'react';
import { useSubscription } from 'use-subscription';

const TARGET = Symbol();

/** 将 Target 封装为 TARGET 属性 */
export const createMutableSource = (target: any, _getVersion: any) => ({
  [TARGET]: target,
});

export const useMutableSource = (
  source: any,
  getSnapshot: any,
  subscribe: any,
) => {
  // Memoize to avoid removing and re-adding subscriptions each time this hook is called.
  const subscription = useMemo(
    () => ({
      getCurrentValue: () => getSnapshot(source[TARGET]),
      // 当值发生变化时，调用 useSubscription 的 subscribe 方法，通知 React 需要重新渲染
      subscribe: (callback: () => void) => subscribe(source[TARGET], callback),
    }),
    [source, getSnapshot, subscribe],
  );

  // 返回的是 value 值
  return useSubscription(subscription);
};
