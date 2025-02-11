import path from 'path'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
      name: 'web-shared',
    },
    rollupOptions: {
      external: [
        'react',
        '@solana/wallet-adapter-react',
        '@solana/wallet-adapter-base',
        '@ethersproject/providers',
      ], // Mark dependencies as external
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  plugins: [nodePolyfills(), dts()],
  resolve: {
    alias: {
      '@ethersproject/providers': path.resolve(
        __dirname,
        '../../../../node_modules/@ethersproject/providers',
      ),
      '@solana/wallet-adapter-react': path.resolve(
        __dirname,
        '../../../../node_modules/@solana/wallet-adapter-react',
      ),
      '@solana/wallet-adapter-base': path.resolve(
        __dirname,
        '../../../../node_modules/@solana/wallet-adapter-base',
      ),
    },
  },
})

// export default defineConfig({
//   plugins: [cssInjectedByJsPlugin()],
//   build: {
//     lib: { entry: './src/index.ts', fileName: 'index', formats: ['es'] },
//     rollupOptions: {
//       external: ['react', 'react/jsx-runtime', 'PACKAGE_A_CONTEXT'],
//     },
//   },
//   resolve: {
//     alias: { PACKAGE_A_CONTEXT: resolve('../../packages/_filepath_/index.ts') },
//   },
// })
