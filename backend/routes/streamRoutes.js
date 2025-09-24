const { Router } = require('express');
const { execFile } = require('node:child_process');
const CFG = require('../core/config');

const r = Router();

// GET /api/stream/logs?domain=facebook.com
// streams tail -F of watcher log over SSH via Server-Sent Events
r.get('/stream/logs', (req, res) => {
  const domain = String(req.query.domain || '').trim().toLowerCase();
  if (!domain) return res.status(400).end('domain required');
  const unit = `bridge-watch-${domain.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const LOG = `/var/log/${unit}.log`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // ssh tail -n 50 -F LOG
  const sshArgs = [
    ...CFG.SSH_OPTS, CFG.SSH_TARGET,
    `/bin/bash -lc 'test -f ${LOG} || touch ${LOG}; tail -n 50 -F ${LOG}'`
  ];
  const child = execFile('ssh', sshArgs);

  const send = (type, data) => {
    res.write(`event: ${type}\n`);
    res.write(`data: ${data}\n\n`);
  };

  child.stdout.on('data', chunk => send('line', String(chunk).replace(/\r?\n$/, '')));
  child.stderr.on('data', chunk => send('stderr', String(chunk).replace(/\r?\n$/, '')));

  child.on('close', code => {
    send('end', `ssh closed with ${code}`);
    res.end();
  });

  req.on('close', () => child.kill('SIGTERM'));
});

module.exports = r;
