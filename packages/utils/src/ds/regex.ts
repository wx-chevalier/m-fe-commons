/** 对于一些常用的正则表达式的集合 */
export const lanIpReg = /(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/;
export const isLanIp = (str: string) => lanIpReg.test(str);
