module.exports = {
  compact: false,
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        importSource: '@emotion/react',
        runtime: 'automatic',
      },
    ],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
  ],
  plugins: ['@babel/plugin-transform-runtime', '@emotion'],
}
