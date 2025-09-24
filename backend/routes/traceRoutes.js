const { Router } = require('express');
const { runSSH, shSingleQuote } = require('../core/ssh');

const r = Router();

// GET /api/trace?domain=facebook.com
r.get('/trace', async (req, res) => {
  const domain = String(req.query.domain || '').trim().toLowerCase();
  if (!domain) return res.status(400).json({ ok:false, error:'domain_required' });

  const unit = `bridge-watch-${domain.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const script = [
    `echo '=== UNIT STATUS ==='`,
    `systemctl status ${unit} --no-pager || true`,
    `echo`,
    `echo '=== KERNEL FORWARDING ==='`,
    `sysctl -n net.ipv4.ip_forward || true`,
    `sysctl -n net.ipv6.conf.all.forwarding || true`,
    `echo`,
    `echo '=== NAT SUMMARY ==='`,
    `sudo nft list table ip nat 2>/dev/null | sed -n '1,120p' || true`,
    `sudo nft list table inet nat 2>/dev/null | sed -n '1,120p' || true`,
    `echo`,
    `echo '=== FORWARD CHAIN (inet filter) ==='`,
    `sudo nft -a list chain inet filter forward 2>/dev/null | sed -n '1,200p' || true`,
    `echo`,
    `echo '=== OUTPUT CHAIN (inet filter) ==='`,
    `sudo nft -a list chain inet filter output 2>/dev/null | sed -n '1,200p' || true`,
    `echo`,
    `echo '=== fb_ips (first 80 lines) ==='`,
    `sudo nft list set inet filter fb_ips 2>/dev/null | sed -n '1,80p' || true`,
    `echo`,
    `echo '=== fb6_ips (first 80 lines) ==='`,
    `sudo nft list set inet filter fb6_ips 2>/dev/null | sed -n '1,80p' || true`,
    `echo`,
    `echo '=== GATEWAY PROBE (curl remote_ip) ==='`,
    `curl -4 -sS -o /dev/null -w 'A %{remote_ip}\\n' https://${domain} -m 5 || echo 'A timed out'`,
    `curl -4 -sS -o /dev/null -w 'A %{remote_ip}\\n' https://www.${domain} -m 5 || echo 'www A timed out'`,
    `curl -6 -sS -o /dev/null -w 'AAAA %{remote_ip}\\n' https://${domain} -m 5 || echo 'AAAA timed out'`,
    `curl -6 -sS -o /dev/null -w 'AAAA %{remote_ip}\\n' https://www.${domain} -m 5 || echo 'www AAAA timed out'`
  ].join(' ; ');
  const remote = `/bin/bash -lc ${shSingleQuote(script)}`;
  const outcome = await runSSH(remote);

  res.json({
    ok: outcome.exitCode === 0,
    domain,
    stdout: outcome.stdout,
    stderr: outcome.stderr,
    exitCode: outcome.exitCode,
  });
});

module.exports = r;
