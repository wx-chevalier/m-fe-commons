/** InputNumber 格式限制 */
export function limitDecimals(value: string | number) {
  const reg = /^(\-)*(\d+)\.(\d\d).*$/;
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
  } else {
    return '';
  }
}
