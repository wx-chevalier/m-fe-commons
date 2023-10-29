/** 将某个 Promise 转化为可撤销的样式 */
export const cancelablePromise = <T>(promise: Promise<T>) => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val =>
      hasCanceled ? reject({ isCanceled: true }) : resolve(val),
    );
    promise.catch(error =>
      hasCanceled ? reject({ isCanceled: true }) : reject(error),
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};

/**
 * 允许进行休眠
 * @param ms 休眠时间
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
