// core/replies.js
function replyFor(ok, built, ssh) {
  if (ok) {
    return built.action === 'block'
      ? `Blocking ${built.target} for ${built.duration} (watcher started).`
      : `Unblocking ${built.target} and removing observed IPs.`;
  }
  const firstStderr = (ssh.stderr && ssh.stderr[0]) ? ssh.stderr[0] : '';
  return `Failed to ${built.action} ${built.target}. Exit ${ssh.exitCode}. ${firstStderr}`.trim();
}

module.exports = { replyFor };
