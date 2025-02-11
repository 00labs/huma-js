import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      fileName: 'index',
      formats: ['es'],
      name: 'widget',
    },
    rollupOptions: {
      external: [
        'react',
        '@solana/wallet-adapter-react',
        '@solana/wallet-adapter-base',
        '@huma-finance/web-shared',
      ], // Mark dependencies as external
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  plugins: [svgr(), nodePolyfills(), dts()],
  // These aliases are required; otherwise contexts aren't shared properly
  // between the monorepo packages: https://github.com/vitejs/vite/discussions/13410
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
      '@huma-finance/web-shared': path.resolve(
        __dirname,
        '../huma-web-shared/src',
      ),
    },
  },
})
