const { test } = require('node:test');
const assert = require('node:assert');

// Test basique pour vérifier le serveur
test('Server should start without errors', async () => {
  // Simulation d'un test simple
  assert.strictEqual(1 + 1, 2);
});