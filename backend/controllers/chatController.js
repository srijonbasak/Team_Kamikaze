// controllers/chatController.js
const { log } = require('../core/logger');
const { extractIntent } = require('../core/intent');
const { normalizeIntent } = require('../core/validators');
const { buildRemoteFromIntent } = require('../core/builder');
const { runSSH } = require('../core/ssh');
const { replyFor } = require('../core/replies');

exports.handleChat = async (req, res) => {
  try {
    const user_text = String((req.body?.message ?? req.query?.message) || '').trim();
    log('chat.incoming', { user_text });
    if (!user_text) return res.status(400).json({ ok: false, error: 'message_required' });

    // 1) NLU
    let rawIntent;
    try { rawIntent = await extractIntent(user_text); }
    catch (e) {
      log('intent.error', { error: String(e?.message || e) });
      return res.status(502).json({ ok: false, error: 'intent_api_failed', detail: String(e.message || e) });
    }

    // 2) Normalize/validate
    const intent = normalizeIntent(rawIntent);
    if (intent.error) return res.status(400).json({ ok: false, error: intent.error, intent });

    // 3) Build remote cmds
    const built = buildRemoteFromIntent(intent);
    log('ssh.build', { remoteCmd: built.cmd });

    // 4) Execute block/unblock
    const ssh = await runSSH(built.cmd);
    const ok = ssh.exitCode === 0;

    // 5) Optional verify
    const verify = await runSSH(built.verifyCmd);

    const reply = replyFor(ok, built, ssh);
    log('chat.reply', { reply });

    res.json({ ok, intent, executed: built.cmd, ssh, verify, reply });
  } catch (e) {
    log('chat.unhandled', { error: String(e?.message || e) });
    res.status(500).json({ ok: false, error: 'server_error', detail: String(e?.message || e) });
  }
};

exports.handleDirectIntent = async (req, res) => {
  try {
    const intent = normalizeIntent(req.body || {});
    log('direct.intent.incoming', intent);
    if (intent.error) return res.status(400).json({ ok: false, error: intent.error, intent });

    const built = buildRemoteFromIntent(intent);
    log('ssh.build', { remoteCmd: built.cmd });

    const ssh = await runSSH(built.cmd);
    const ok = ssh.exitCode === 0;

    const verify = await runSSH(built.verifyCmd);
    const reply = replyFor(ok, built, ssh);

    log('direct.intent.reply', { reply });
    res.json({ ok, intent, executed: built.cmd, ssh, verify, reply });
  } catch (e) {
    log('direct.intent.unhandled', { error: String(e?.message || e) });
    res.status(500).json({ ok: false, error: 'server_error', detail: String(e?.message || e) });
  }
};
