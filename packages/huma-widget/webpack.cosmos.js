const webpack = require('webpack')
const dotenv = require('dotenv')

module.exports = (webpackConfig) => {
  const { module } = webpackConfig
  const { rules } = module
  return {
    ...webpackConfig,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer'),
      },
    },
    module: {
      rules: [
        ...rules,
        {
          test: /\.svg$/i,
          use: ['@svgr/webpack', 'url-loader'],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.DefinePlugin({
        ...Object.entries(dotenv.config().parsed).reduce(
          (acc, curr) => ({
            ...acc,
            [`process.env.${curr[0]}`]: JSON.stringify(curr[1]),
          }),
          {},
        ),
      }),
    ],
  }
}
