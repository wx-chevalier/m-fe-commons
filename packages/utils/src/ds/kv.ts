/**
 * 将某个对象转化为 KV
 * @param obj Record 对象
 */
export function transformToKV(obj: Record<string, unknown>) {
  const kvEntries: {
    key: string;
    type: string;
    value: string | number;
  }[] = [];

  Object.keys(obj).forEach(k => {
    let type;
    let value = obj[k] as string | number;

    if (!obj[k]) {
      return;
    }

    if (typeof obj[k] === 'number') {
      type = 'LONG';
    } else if (typeof obj[k] === 'object') {
      type = 'STRING';
      value = JSON.stringify(value);
    } else {
      type = 'STRING';
    }

    kvEntries.push({
      key: k,
      type,
      value,
    });
  });

  return kvEntries;
}
