const { addBabelPlugin, addBabelPreset, override } = require('customize-cra')

module.exports = override(
  addBabelPlugin('@emotion/babel-plugin'),
  addBabelPreset([
    '@babel/preset-react',
    { importSource: '@emotion/react', runtime: 'automatic' },
  ]),
)
