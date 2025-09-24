// core/config.js
const path = require('node:path');

const CFG = {
  // Intent API
  INTENT_URL_PRIMARY : process.env.INTENT_URL_PRIMARY  || 'https://cmfy0xyta4z6ro3wtjc4glhva.agent.pa.smyth.ai/api/extract_intent',
  INTENT_URL_FALLBACK: process.env.INTENT_URL_FALLBACK || 'https://cmfy0xyta4z6ro3wtjc4glhva.agent.a.smyth.ai/api/extract_intent',
  INTENT_TIMEOUT_MS  : Number(process.env.INTENT_TIMEOUT_MS || 12000),

  // SSH
  SSH_TARGET: process.env.SSH_TARGET || 'lab@192.168.56.10',
  SSH_KEY   : process.env.SSH_KEY    || path.join(process.env.HOME || '/home/lab', '.ssh', 'sre_agent_key'),
  SSH_OPTS  : [
    '-i', process.env.SSH_KEY || path.join(process.env.HOME || '/home/lab', '.ssh', 'sre_agent_key'),
    '-o', 'BatchMode=yes',
    '-o', 'StrictHostKeyChecking=accept-new',
  ],
  SSH_TIMEOUT_MS: Number(process.env.SSH_TIMEOUT_MS || 30000),

  // Remote binaries on gateway
  REMOTE_BIN: process.env.REMOTE_BIN || '/usr/local/bin/bridge_block.sh',
  WATCH_BIN : process.env.WATCH_BIN  || '/usr/local/bin/bridge_watch.sh',
  UNOBS_BIN : process.env.UNOBS_BIN  || '/usr/local/bin/bridge_unobserve.sh',

  // Watcher behaviour
  WATCH_INTERVAL_SEC: Number(process.env.WATCH_INTERVAL_SEC || 10),
  WATCH_TTL         : process.env.WATCH_TTL || '10m',

  // Misc
  SUDO: 'sudo -n',
};

module.exports = CFG;
