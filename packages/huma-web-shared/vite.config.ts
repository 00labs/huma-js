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
