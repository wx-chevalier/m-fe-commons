module.exports = {
  presets: [
    [
      '@m-fe',
      {
        import: true,
        react: true,
        typescript: true,
      },
    ],
  ],
  plugins: [['import', { libraryName: 'antd-mobile', style: true }]],
};
