/** 将某个对象转化为 KV */
export function transformToKV(obj: object) {
  const kvEntries: {
    key: string;
    type: string;
    value: string | number;
  }[] = [];

  Object.keys(obj).forEach(k => {
    let type;

    if (typeof obj[k] === 'number') {
      type = 'LONG';
    } else {
      type = 'STRING';
    }

    kvEntries.push({
      key: k,
      type,
      value: obj[k],
    });
  });

  return kvEntries;
}
