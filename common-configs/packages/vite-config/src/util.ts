import { promises as fs } from 'fs';
import { ConfigEnv, UserConfig, UserConfigExport, UserConfigFn, mergeConfig as viteMergeConfig } from 'vite';
import * as readPkg from 'read-pkg';

export const readFile = fs.readFile;
export const copyFile = fs.copyFile;
export const mkdir = fs.mkdir;

export type Interceptor = (config: UserConfig, env: ConfigEnv) => UserConfig | Promise<UserConfig> | undefined;

export function tapConfig(config: UserConfigExport, interceptor: Interceptor): UserConfigFn {
  return async function modifiedConfig(env: ConfigEnv) {
    const userConfig =
      (await (typeof config === 'function' ? config(env) : config)) || {};

    return interceptor(userConfig, env) ?? userConfig;
  };
}

export function mergeConfig(a: UserConfig, b: UserConfig) {
  return viteMergeConfig(a, b);
}

const pkg = readPkg();
export async function readPackage() {
  return pkg;
}
