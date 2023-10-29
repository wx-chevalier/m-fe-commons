import * as path from 'path';
import * as _ from 'lodash';
import type { UserConfig, BuildOptions } from 'vite';
import { readPackage } from '../util';

export default async function configBuild({
  build,
}: UserConfig = {}): Promise<UserConfig> {
  if (build?.lib && build.lib.formats) {
    console.warn(`[build.lib.format] 不支持配置`);
  }
  const pkg = await readPackage();
  const buildTarget = (process.env.BUILD_TARGET || 'cdn') as 'cdn' | 'npm';
  const rollupOptions: BuildOptions['rollupOptions'] =
    buildTarget === 'npm'
      ? {
          external: id =>
            !(path.isAbsolute(id) || id.startsWith('.') || id.startsWith('@/')),
          preserveEntrySignatures: 'strict',
          output: {
            format: 'es',
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: 'src',
            dir: build?.outDir || 'dist',
            entryFileNames: '[name].js',
            assetFileNames: assetInfo => {
              if (assetInfo.name === 'style.css') return 'index.css';
              return 'assets/[name]-[hash][extname]';
            },
          },
        }
      : {
          output: {
            format: 'amd',
            sourcemap: process.env.BUILD_ENV === 'cloud' ? 'hidden' : true,
            amd: {
              id: pkg.name,
              // autoId: true,
              // basePath: pkg.name,
            },
            dir: process.env.BUILD_DEST || build?.outDir || 'dist',
            entryFileNames: process.env.BUILD_DEST
              ? '[name].js'
              : '[name].amd.js',
            assetFileNames: assetInfo => {
              if (assetInfo.name === 'style.css') return 'index.css';
              return 'assets/[name]-[hash][extname]';
            },
          },
        };

  return {
    css: {
      modules: {
        generateScopedName(name: string, filename: string): string {
          return [
            pkg.name,
            path
              .relative(path.join(process.cwd(), 'src'), filename)
              .replace('/index.module.less', '')
              .replace('/.module.less', ''),
            name,
          ]
            .map(_.kebabCase)
            .join('_');
        },
      },
    },
    build: {
      ...(buildTarget === 'npm'
        ? {
            minify: 'terser',
            terserOptions: {
              compress: false,
              mangle: false,
            },
          }
        : null),
      cssCodeSplit: false,
      lib: {
        entry: path.join(process.cwd(), 'src/index.ts'),
        name: pkg.name,
        formats: [buildTarget === 'cdn' ? ('amd' as 'umd') : 'es'],
      },
      target: 'chrome80',
      rollupOptions,
    },
  };
}

