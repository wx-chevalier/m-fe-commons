import * as path from 'path';
import * as _ from 'lodash';
import { loadEnv, UserConfigExport, UserConfigFn } from 'vite';
import { mergeConfig, Interceptor, tapConfig } from './util';

export default function defineConfig(config?: UserConfigExport): UserConfigFn {
  return tapConfig(config ?? {}, async (userConfig, { command, mode }) => {
    Object.assign(
      process.env,
      loadEnv(mode, userConfig.root || process.cwd(), '')
    );

    const commonConfig = mergeConfig(
      {
        build: {
          minify: 'terser',
          terserOptions: {
            keep_classnames: true,
          }
        },
        esbuild: userConfig?.esbuild ?? {
          keepNames: true,
          jsxFactory: '_React.createElement',
          jsxFragment: '_React.Fragment',
          jsxInject: `import * as _React from 'react'`,
        },
        optimizeDeps: {
          esbuildOptions: {
            keepNames: true,
          },
        },
        resolve: {
          alias: [
            {
              find: /^~(.*)/,
              replacement: `${path.join(process.cwd(), 'node_modules')}/$1`,
            },
            {
              find: /^@\/(.*)/,
              replacement: `${path.join(process.cwd(), 'src')}/$1`,
            },
          ],
          mainFields: ['browser', 'module', 'jsnext:main', 'jsnext', 'main'],
        },
        css: {
          modules: {
            localsConvention: 'camelCaseOnly',
          },
        },
      },
      userConfig
    );

    if (!['serve', 'build'].includes(command)) return userConfig;

    const config = (
      await (command === 'serve'
        ? import('./config/serve')
        : import('./config/build'))
    ).default;

    return mergeConfig(await config(userConfig), commonConfig);
  });
}

export function tapXixiConfig(interceptor: Interceptor): UserConfigFn;
export function tapXixiConfig(
  config: UserConfigExport,
  interceptor: Interceptor
): UserConfigFn;
export function tapXixiConfig(
  config: UserConfigExport | Interceptor,
  interceptor?: Interceptor
) {
  if (interceptor)
    return tapConfig(defineConfig(config as UserConfigExport), interceptor);
  return tapConfig(defineConfig(), config as Interceptor);
}

export { defineConfig, tapConfig };

export type { Interceptor };
