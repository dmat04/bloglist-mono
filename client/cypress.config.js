const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:8000',
  },
  env: {
    BACKEND: 'http://localhost:8000/api',
  },
  video: false,
})
