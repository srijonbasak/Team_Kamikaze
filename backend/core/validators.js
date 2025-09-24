// core/validators.js
const DURATION_RE = /^[1-9]\d*(m|h|d)$/i;

function durationToSeconds(dur) {
  const m = String(dur || '').trim().match(/^([1-9]\d*)(m|h|d)$/i);
  if (!m) return 7200;
  const n = parseInt(m[1], 10);
  const u = m[2].toLowerCase();
  if (u === 'm') return n * 60;
  if (u === 'h') return n * 3600;
  if (u === 'd') return n * 86400;
  return 7200;
}

function unitNameForTarget(target) {
  return `bridge-watch-${String(target || '').replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function normalizeIntent(i) {
  const action = (i?.action || 'none').toLowerCase();
  const ttype  = (i?.target_type || '').toLowerCase();
  const target = (i?.target || '').toLowerCase();
  let duration = i?.duration ? String(i.duration).toLowerCase() : null;

  if (!['block', 'unblock'].includes(action)) return { error: 'unsupported_action', action };
  if (ttype !== 'domain') return { error: 'unsupported_target_type', ttype };
  if (!target)            return { error: 'missing_target' };

  if (action === 'block') {
    duration = duration && DURATION_RE.test(duration) ? duration : '2h';
  } else {
    duration = null;
  }

  return { action, ttype, target, duration };
}

module.exports = { durationToSeconds, unitNameForTarget, normalizeIntent, DURATION_RE };
