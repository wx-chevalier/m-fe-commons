import * as _ from 'lodash';
import type { UserConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default async function configServe(): Promise<UserConfig> {

  return {
    optimizeDeps: {
      entries: ['src/index.*'],
      include: ['react', 'react-dom', 'react-dom/server'],
      esbuildOptions: {
        plugins: [
          // fix: https://github.com/evanw/esbuild/issues/1348
          // 这里不能直接使用 define 选项，vite 内部没有做 define 的 merge
          {
            name: 'remove-amd',
            setup(build) {
              const options = build.initialOptions;
              options.define = options.define || {};
              // https://github.com/umdjs/umd/blob/master/templates/nodeAdapter.js
              // https://stackoverflow.com/questions/42293412/what-is-the-purpose-of-define-amd-jquery-true-in-the-code-of-requirejs
              // options.define['define.amd'] = 'undefined';
              options.define.define = 'undefined';
            },
          },
          // https://github.com/vitejs/vite/issues/4312
          {
            name: 'fix-external',
            setup(build) {
              const {external} = build.initialOptions;

              build.onResolve(
                { filter: /^[\w@][^:]/ },
                async ({ path: id }) => {
                  if (external?.includes(id)) {
                    return {
                      path: id,
                      external: true,
                    };
                  }
                }
              );
            },
          },
        ],
      },
    },
    server: {
      host: 'local.crm.taobao.net',
      port: 8080,
      https: true,
      open: true,
    },
    plugins: [
      reactRefresh(),
    ],
  };
}
