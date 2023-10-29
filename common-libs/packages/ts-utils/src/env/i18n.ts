export type I18nFormat = (
  id: string,
  values?: Record<string, any>,
  defaultMessage?: string,
) => string;

let i18nFormat: I18nFormat;

export function setI18nFormat(_i: I18nFormat) {
  i18nFormat = _i;
}

export function getI18nFormat() {
  const a = (a: string) => `${a}`;

  return i18nFormat || a;
}
