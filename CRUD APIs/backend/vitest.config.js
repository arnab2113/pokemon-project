const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./src/tests/setup.js'],
    globals: true,
    fileParallelism: false,
    hookTimeout: 120000,
    testTimeout: 30000,
  },
});
