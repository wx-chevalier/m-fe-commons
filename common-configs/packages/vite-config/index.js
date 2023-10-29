const path = require('path');

const reactRefresh = require('@vitejs/plugin-react-refresh');
const { defineConfig } = require('vite');
const legacy = require('@vitejs/plugin-legacy');
const { default: createImportPlugin } = require('vite-plugin-import');
const { VitePWA } = require('vite-plugin-pwa');
const { default: tsconfigPaths } = require('vite-tsconfig-paths');

exports.genConfig = basePath =>
  defineConfig({
    alias: {
      '@/': path.resolve(basePath, './src'),
    },
    plugins: [
      reactRefresh(),
      legacy({
        targets: ['defaults', 'not ie <= 10'],
      }),
      createImportPlugin([
        {
          libraryName: 'antd',
          style: true, // or 'css'
        },
        {
          libraryName: 'antd-mobile',
          style: true, // or 'css'
        },
      ]),
      VitePWA(),
      tsconfigPaths(),
    ],
  });
