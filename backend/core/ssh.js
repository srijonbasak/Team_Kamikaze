// core/ssh.js
const { execFile } = require('node:child_process');
const CFG = require('./config');
const { log } = require('./logger');

function shSingleQuote(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

function runSSH(remoteCmd) {
  const args = [...CFG.SSH_OPTS, CFG.SSH_TARGET, remoteCmd];
  log('ssh.exec', { target: CFG.SSH_TARGET, cmd: remoteCmd, key: CFG.SSH_KEY.replace(/.*\//, '***/') });

  return new Promise((resolve) => {
    execFile('ssh', args, { timeout: CFG.SSH_TIMEOUT_MS, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      const exitCode = (err && Number.isInteger(err.code)) ? err.code : 0;
      const result = {
        exitCode,
        stdout: (stdout || '').split('\n').slice(0, 400),
        stderr: (stderr || '').split('\n').slice(0, 400),
      };
      log('ssh.result', result);
      resolve(result);
    });
  });
}

module.exports = { runSSH, shSingleQuote };
