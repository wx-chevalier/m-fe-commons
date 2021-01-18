let i18nFormat: (id: string, values?: Record<string, any>) => string;

export function setI18nFormat(_i: (id: string, values?: Record<string, any>) => string) {
  i18nFormat = _i;
}

export function getI18nFormat() {
  const a = (a: string) => a;
  return i18nFormat || a;
}
