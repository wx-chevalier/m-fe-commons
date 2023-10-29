import { parseUrl } from './uri';

const maxIPv4Length = 15;
const maxIPv6Length = 45;

const options = {
  timeout: 400,
};

export function isIP(string: string) {
  if (string.length > maxIPv6Length) {
    return false;
  }

  return isIPv4(string) || isIPv6(string);
}

export function isIPv6(string: string) {
  if (!string) {
    return false;
  }

  if (string.length > maxIPv6Length) {
    return false;
  }

  return string.match(ipRegex.v6({ includeBoundaries: true }));
}

export function isIPv4(string: string) {
  if (!string) {
    return false;
  }

  if (string.length > maxIPv4Length) {
    return false;
  }

  return string.match(ipRegex.v4({ includeBoundaries: true }));
}

export function ipVersion(string: string) {
  if (isIPv6(string)) {
    return 6;
  }

  if (isIPv4(string)) {
    return 4;
  }
}

/** 对于一些常用的正则表达式的集合 */
export const lanIpReg = /(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/;

export const isLanIp = (str: string) => {
  if (str.includes('http')) {
    const host = parseUrl(str)['host'];

    return lanIpReg.test(host);
  }

  return lanIpReg.test(str);
};

const word = '[a-fA-F\\d:]';

interface BoundaryOptions {
  includeBoundaries?: boolean;
  exact?: boolean;
}

const boundary = (options: BoundaryOptions) =>
  options && options.includeBoundaries
    ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))`
    : '';

const v4 =
  '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

const v6segment = '[a-fA-F\\d]{1,4}';

const v6 = `
(?:
(?:${v6segment}:){7}(?:${v6segment}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6segment}:){6}(?:${v4}|:${v6segment}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6segment}:){5}(?::${v4}|(?::${v6segment}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6segment}:){4}(?:(?::${v6segment}){0,1}:${v4}|(?::${v6segment}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6segment}:){3}(?:(?::${v6segment}){0,2}:${v4}|(?::${v6segment}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6segment}:){2}(?:(?::${v6segment}){0,3}:${v4}|(?::${v6segment}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6segment}:){1}(?:(?::${v6segment}){0,4}:${v4}|(?::${v6segment}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6segment}){0,5}:${v4}|(?::${v6segment}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`
  .replace(/\s*\/\/.*$/gm, '')
  .replace(/\n/g, '')
  .trim();

// Pre-compile only the exact regexes because adding a global flag make regexes stateful
const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
const v4exact = new RegExp(`^${v4}$`);
const v6exact = new RegExp(`^${v6}$`);

const ipRegex = (options: BoundaryOptions) =>
  options && options.exact
    ? v46Exact
    : new RegExp(
        `(?:${boundary(options)}${v4}${boundary(options)})|(?:${boundary(
          options,
        )}${v6}${boundary(options)})`,
        'g',
      );

ipRegex.v4 = (options: BoundaryOptions) =>
  options && options.exact
    ? v4exact
    : new RegExp(`${boundary(options)}${v4}${boundary(options)}`, 'g');

ipRegex.v6 = (options: BoundaryOptions) =>
  options && options.exact
    ? v6exact
    : new RegExp(`${boundary(options)}${v6}${boundary(options)}`, 'g');
