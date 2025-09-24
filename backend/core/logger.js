// core/logger.js
const util = require('node:util');

function log(label, payload) {
  const ts = new Date().toISOString();
  const body = (payload === undefined) ? '' : '\n' + util.inspect(payload, { colors: true, depth: 8 });
  console.log(`[${ts}] ${label}:${body}`);
}

module.exports = { log };
