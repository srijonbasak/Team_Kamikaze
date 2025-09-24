// core/builder.js
const CFG = require('./config');
const { shSingleQuote } = require('./ssh');
const { durationToSeconds, unitNameForTarget } = require('./validators');

// Build *remote* command to be executed over SSH.
// Returns { cmd, action, target, duration, unit, verifyCmd }
function buildRemoteFromIntent({ action, ttype, target, duration }) {
  const unit  = unitNameForTarget(target);

  if (action === 'block') {
    const windowSecs = durationToSeconds(duration);
    const LOG = `/var/log/${unit}.log`;

    // Block first; stop stale unit; then start watcher with internal logging.
    const watcherCmd = `/bin/bash -lc ${shSingleQuote(
      `${CFG.WATCH_BIN} ${target} ${windowSecs} ${CFG.WATCH_INTERVAL_SEC} ${CFG.WATCH_TTL} >>${LOG} 2>&1`
    )}`;

    const inner = [
      `${CFG.SUDO} ${CFG.REMOTE_BIN} block domain ${target} ${duration}`,
      `${CFG.SUDO} /usr/bin/systemctl stop '${unit}' || true`,
      `${CFG.SUDO} /usr/bin/systemd-run -q --unit='${unit}' --property=Restart=no --collect ${watcherCmd} || echo '[warn] watcher failed to start'`
    ].join(' ; ');

    const cmd = `/bin/bash -lc ${shSingleQuote(inner)}`;

    const verifyInner = [
      "echo '[verify] watcher:'",
      `systemctl status '${unit}' --no-pager || true`,
      "echo '[verify] fb_ips size:'",
      "sudo nft list set inet filter fb_ips 2>/dev/null | wc -l || true",
      "echo '[verify] fb6_ips size:'",
      "sudo nft list set inet filter fb6_ips 2>/dev/null | wc -l || true"
    ].join(' ; ');
    const verifyCmd = `/bin/bash -lc ${shSingleQuote(verifyInner)}`;

    return { cmd, action, target, duration, unit, verifyCmd };
  }

  // unblock
  const inner = [
    `${CFG.SUDO} /usr/bin/systemctl stop '${unit}' || true`,
    `${CFG.SUDO} ${CFG.UNOBS_BIN} ${target}`,
    `${CFG.SUDO} ${CFG.REMOTE_BIN} unblock domain ${target}`
  ].join(' && ');

  const cmd = `/bin/bash -lc ${shSingleQuote(inner)}`;
  const verifyInner = [
    "echo '[verify] watcher:'",
    `systemctl status '${unit}' --no-pager || true`,
    "echo '[verify] fb_ips size:'",
    "sudo nft list set inet filter fb_ips 2>/dev/null | wc -l || true",
    "echo '[verify] fb6_ips size:'",
    "sudo nft list set inet filter fb6_ips 2>/dev/null | wc -l || true"
  ].join(' ; ');
  const verifyCmd = `/bin/bash -lc ${shSingleQuote(verifyInner)}`;

  return { cmd, action, target, duration: null, unit, verifyCmd };
}

module.exports = { buildRemoteFromIntent };
