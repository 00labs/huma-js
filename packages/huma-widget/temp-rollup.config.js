const { babel } = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const inject = require('@rollup/plugin-inject')
const json = require('@rollup/plugin-json')
const { nodeResolve: resolve } = require('@rollup/plugin-node-resolve')
const { default: dts } = require('rollup-plugin-dts')
const url = require('@rollup/plugin-url')
const svgr = require('@svgr/rollup')
const externals = require('rollup-plugin-node-externals')
const sass = require('rollup-plugin-scss')

const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']

const transpile = {
  input: 'src/index.tsx',
  external: (source) => {
    return source.startsWith('@ethersproject/')
  },
  plugins: [
    externals({
      exclude: [/\.json$/, /\.css$/],
      deps: true,
      peerDeps: true,
    }),
    resolve({ extensions: EXTENSIONS }),
    json(),
    url({ include: ['**/*.png', '**/*.svg', '**/*.gif'], limit: Infinity }),
    svgr({ jsxRuntime: 'automatic' }),
    sass(),
    commonjs(),

    babel({
      babelHelpers: 'runtime',
      extensions: EXTENSIONS,
    }),
    inject({ React: 'react' }),
  ],
  onwarn: (warning, warn) => {
    if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
    if (warning.code === 'THIS_IS_UNDEFINED') return
    if (warning.code === 'CIRCULAR_DEPENDENCY') return

    warn(warning)
    console.log(warning.loc, '\n')
  },
}

const esm = {
  ...transpile,
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
}

const cjs = {
  ...transpile,
  output: {
    dir: 'dist/cjs',
    entryFileNames: '[name].cjs',
    chunkFileNames: '[name]-[hash].cjs',
    format: 'cjs',
    sourcemap: true,
  },
  watch: false,
}

const types = {
  input: 'dts/index.d.ts',
  output: { file: 'dist/index.d.ts' },
  external: (source) =>
    source.endsWith('.css') || source.endsWith('/external.d.ts'),
  plugins: [dts({ compilerOptions: { baseUrl: 'dts' } })],
  watch: false,
}

const config = [esm, cjs, types]
config.config = { ...esm, output: { ...esm.output, sourcemap: true } }

module.exports = config
