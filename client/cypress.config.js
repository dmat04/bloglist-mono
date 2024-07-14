// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:8000',
  },
  env: {
    BACKEND: 'http://localhost:8000/api',
  },
  video: false,
})
