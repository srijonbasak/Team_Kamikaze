// core/intent.js
const fetch = require('node-fetch');
const CFG = require('./config');
const { log } = require('./logger');

async function callIntentOnce(url, user_text, signal) {
  log('intent.request', { url, body: { user_text } });
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ user_text }),
    signal,
  });

  const status = r.status;
  const headers = Object.fromEntries([...r.headers.entries()]);
  let json; try { json = await r.json(); } catch { json = {}; }
  log('intent.response', { url, status, headers, body: json });
  if (!r.ok) throw new Error(`Intent API ${status} @ ${url}`);

  let raw = json?.result?.Output || json?.result || '';
  if (typeof raw !== 'string') raw = JSON.stringify(raw || '');
  raw = raw.trim().replace(/^```json\s*/i, '').replace(/```$/i, '');

  const intent = JSON.parse(raw);
  log('intent.parsed', intent);
  return intent;
}

async function extractIntent(user_text) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CFG.INTENT_TIMEOUT_MS);
  try {
    try {
      const i = await callIntentOnce(CFG.INTENT_URL_PRIMARY, user_text, ctrl.signal);
      log('intent.success_using', { url: CFG.INTENT_URL_PRIMARY });
      return i;
    } catch (e1) {
      log('intent.error_try', { url: CFG.INTENT_URL_PRIMARY, error: String(e1.message || e1) });
      const i = await callIntentOnce(CFG.INTENT_URL_FALLBACK, user_text, ctrl.signal);
      log('intent.success_using', { url: CFG.INTENT_URL_FALLBACK });
      return i;
    }
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { extractIntent };
