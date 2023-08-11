import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'yq9qu9',
  videoUploadOnPasses: false,
  defaultCommandTimeout: 10000,
  chromeWebSecurity: false,
  e2e: {
    testIsolation: false,
    setupNodeEvents(on, config) {
      return {
        ...config,
        // Only enable Chrome.
        // Electron (the default) has issues injecting window.ethereum before pageload, so it is not viable.
        browsers: config.browsers.filter(({ name }) => name === 'chrome'),
      }
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
