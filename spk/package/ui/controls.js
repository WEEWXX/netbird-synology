/* Connection actions go through the DSM-authenticated CGI, never to a public
 * daemon endpoint. Keep form state separate from the periodically refreshed UI. */
(function () {
  'use strict';
  const ui = window.NetBirdUI;
  const t = (key, values) => ui.t(key, values);
  const byId = (id) => document.getElementById(id);
  const form = byId('enroll-form');
  if (!form) return;
  const loginStates = ['NeedsLogin', 'LoginFailed', 'SessionExpired'];
  let busy = false;
  let refreshing = false;
  let generation = 0;
  let available = true;
  let detailsAvailable = false;
  let detailsRefreshing = false;
  let bundle = {};
  let debug = {};
  let logs = byId('recent-logs').textContent.split('\n');
  let statusWarning = false;

  function message(text, error) {
    statusWarning = false;
    byId('control-message').textContent = text;
    byId('control-message').dataset.error = error ? 'true' : 'false';
  }

  function syncControls() {
    const state = byId('status-content').dataset.state;
    const login = loginStates.includes(state);
    const secure = window.location.protocol === 'https:';
    byId('connect').hidden = state !== 'Idle';
    byId('disconnect').hidden = !['Connected', 'Connecting'].includes(state);
    byId('disconnect-note').hidden = byId('disconnect').hidden;
    form.hidden = !login;
    if (!login) byId('setup-key').value = '';
    for (const id of ['connect', 'disconnect', 'enroll-fields']) {
      byId(id).disabled = busy || !secure || !available || bundle.state === 'running';
    }
    const notice = byId('controls-unavailable');
    notice.textContent = !secure ? t('controls.https') :
      state === 'Unavailable' ? t('controls.startFirst') : '';
    notice.hidden = !notice.textContent;
    byId('connect').textContent = busy ? t('controls.working') : t('controls.connect');
    byId('disconnect').textContent = busy ? t('controls.working') : t('controls.disconnect');
    byId('enroll').textContent = busy ? t('controls.enrolling') : t('controls.enroll');
    const copy = byId('copy-ip');
    if (copy) copy.disabled = false;
    byId('diagnostics-fields').disabled = busy || !secure || !available || !detailsAvailable || bundle.state === 'running';
    byId('debug-start').hidden = debug.active === true;
    byId('debug-stop').hidden = debug.active !== true;
    byId('bundle-create').disabled = bundle.state === 'running';
    byId('bundle-download').disabled = busy || !secure || !available || !bundle.download;
  }

  async function refreshStatus() {
    if (busy || refreshing) return;
    if (bundle.state === 'running') {
      await refreshDetails();
      return;
    }
    refreshing = true;
    const current = generation;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(window.location.href, {
        credentials: 'same-origin', cache: 'no-store', signal: controller.signal
      });
      if (current !== generation || busy) return;
      if (response.status === 401 || response.status === 403) {
        available = false;
        message(t('controls.sessionExpired'), true);
        return;
      }
      if (!response.ok) throw new Error(t('status.unavailable'));
      const next = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (current !== generation || busy) return;
      for (const id of ['status-content', 'external-links']) {
        const replacement = next.getElementById(id);
        if (!replacement) throw new Error(t('status.unavailable'));
        byId(id).replaceWith(document.importNode(replacement, true));
        ui.apply(byId(id));
      }
      const log = next.querySelector('#recent-logs');
      if (log && !detailsAvailable) {
        logs = log.textContent.split('\n');
        filterLogs();
      }
      available = true;
      if (statusWarning) { message('', false); statusWarning = false; }
    } catch (error) {
      if (current !== generation || busy) return;
      available = false;
      message(t('controls.refreshFailed'), true);
      statusWarning = true;
    } finally {
      clearTimeout(timer);
      refreshing = false;
      syncControls();
      await refreshDetails();
    }
  }

  async function sessionToken(signal) {
    const current = new URLSearchParams(window.location.search).get('SynoToken');
    if (current) return current;
    const response = await fetch('/webman/login.cgi', {credentials: 'same-origin', cache: 'no-store', signal});
    if (!response.ok) throw new Error('Session unavailable');
    const session = await response.json();
    if (typeof session.SynoToken !== 'string' || !session.SynoToken) throw new Error('Session unavailable');
    return session.SynoToken;
  }

  async function act(payload) {
    if (busy || !available || window.location.protocol !== 'https:') return;
    busy = true;
    generation++;
    syncControls();
    const diagnostic = payload.action.startsWith('debug-') || payload.action.startsWith('bundle-');
    const showMessage = diagnostic ? diagnosticMessage : message;
    showMessage(diagnostic ? t('controls.working') : payload.action === 'enroll' ? t('controls.enrollingNAS') :
      payload.action === 'disconnect' ? t('controls.disconnecting') : t('controls.connecting'), false);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const token = await sessionToken(controller.signal);
      const response = await fetch('action.cgi', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: {'Content-Type': 'application/json', 'X-SYNO-TOKEN': token, 'X-NetBird-Action': '1'},
        body: JSON.stringify(payload), signal: controller.signal
      });
      if (payload.action === 'bundle-download' && response.ok) {
        if (response.headers.get('Content-Type') !== 'application/zip') throw new Error('Invalid download');
        const url = URL.createObjectURL(await response.blob());
        const link = document.createElement('a');
        link.href = url; link.download = 'netbird-debug.zip';
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        showMessage(t('bundle.downloaded'), false);
        return;
      }
      const result = await response.json();
      if (typeof result.message !== 'string' || typeof result.ok !== 'boolean') throw new Error('Invalid response');
      showMessage(ui.message(result.message), !response.ok || !result.ok);
      if (payload.action === 'bundle-create' && response.ok && result.ok) {
        diagnosticMessage('', false);
        bundle = {state: 'running'};
        renderBundle();
      }
    } catch (error) {
      showMessage(diagnostic ? t('diagnostics.unconfirmed') :
        t('controls.unconfirmed'), true);
    } finally {
      clearTimeout(timer);
      delete payload.setupKey;
      busy = false;
      syncControls();
      await refreshStatus();
    }
  }

  byId('connect').addEventListener('click', () => act({action: 'connect'}));
  byId('disconnect').addEventListener('click', () => {
    if (window.confirm(t('controls.confirmDisconnect'))) {
      act({action: 'disconnect'});
    }
  });
  function syncServerSelection() {
    const selfHosted = byId('server-self-hosted').checked;
    byId('management-field').hidden = !selfHosted;
    byId('management-url').required = selfHosted;
    byId('management-url').disabled = !selfHosted;
  }
  for (const id of ['server-cloud', 'server-self-hosted']) {
    byId(id).addEventListener('change', syncServerSelection);
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (busy || !available || !form.reportValidity()) return;
    const payload = {
      action: 'enroll', setupKey: byId('setup-key').value.trim(),
      managementUrl: byId('server-self-hosted').checked ? byId('management-url').value.trim() : 'https://api.netbird.io:443'
    };
    byId('setup-key').value = '';
    act(payload);
  });

  function diagnosticMessage(text, error) {
    byId('diagnostic-message').textContent = text;
    byId('diagnostic-message').dataset.error = error ? 'true' : 'false';
  }

  function filterLogs() {
    const level = byId('log-filter').value;
    const search = byId('log-search').value.toLowerCase();
    const shown = logs.filter(line => line.toLowerCase().includes(search) &&
      (level === 'all' || (level === 'errors' ? /\b(ERRO\w*|FATL|FATAL|PANI\w*)\b/ : /\b(WARN\w*|ERRO\w*|FATL|FATAL|PANI\w*)\b/).test(line)));
    const pre = byId('recent-logs');
    pre.replaceChildren();
    for (const line of shown) {
      const span = document.createElement('span');
      span.className = /\b(ERRO\w*|FATL|FATAL|PANI\w*)\b/.test(line) ? 'lvl-error' : /\bWARN\w*\b/.test(line) ? 'lvl-warn' : /\bINFO\b/.test(line) ? 'lvl-info' : '';
      span.textContent = line + '\n';
      pre.appendChild(span);
    }
    if (!shown.length) pre.textContent = t('logs.none');
    byId('log-count').textContent = t('logs.count', {shown:ui.number(shown.length),total:ui.number(logs.length)});
  }

  function formatBytes(raw) {
    if (typeof raw !== 'string' || !/^\d+$/.test(raw)) return '—';
    let value = Number(raw), unit = 0;
    const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
    return `${ui.number(Number(value.toFixed(unit ? 1 : 0)))} ${units[unit]}`;
  }

  function handshake(raw) {
    const instant = Date.parse(raw);
    if (!Number.isFinite(instant) || instant <= 0) return t('peers.notYet');
    const seconds = Math.max(0, Math.floor((Date.now() - instant) / 1000));
    if (seconds < 60) return t('peers.justNow');
    if (seconds < 3600) return ui.relative(-Math.floor(seconds / 60),'minute');
    if (seconds < 86400) return ui.relative(-Math.floor(seconds / 3600),'hour');
    return ui.relative(-Math.floor(seconds / 86400),'day');
  }

  function renderPeers(peers, total) {
    const rows = byId('peer-rows');
    rows.replaceChildren();
    for (const peer of peers) {
      const row = document.createElement('tr');
      const latency = /^\d+(\.\d+)?s$/.test(peer.latency) ? parseFloat(peer.latency) * 1000 : 0;
      const columns = [
        [peer.name || t('peers.unnamed'), peer.ip || t('peers.noIP')],
        [ui.message(peer.state || 'Unknown'), ui.message(peer.connection || '')],
        [latency > 0 ? `${latency < 1 ? '<1' : Math.round(latency)} ms` : '—'],
        [handshake(peer.handshake)],
        [formatBytes(peer.received), formatBytes(peer.sent)]
      ];
      for (const [primary, secondary] of columns) {
        const cell = document.createElement('td');
        cell.textContent = primary;
        if (secondary) {
          const detail = document.createElement('small'); detail.textContent = secondary; cell.appendChild(detail);
        }
        row.appendChild(cell);
      }
      rows.appendChild(row);
    }
    byId('peer-count').textContent = total ? (peers.length < total ? t('peers.partial',{shown:ui.number(peers.length),total:ui.number(total)}) : `(${ui.number(total)})`) : '(0)';
    byId('peer-empty').hidden = peers.length > 0;
    byId('peer-empty').textContent = t('peers.none');
    byId('peer-scroll').hidden = peers.length === 0;
  }

  function renderBundle() {
    byId('bundle-message').textContent = bundle.state === 'running' ? t('bundle.creating') : ui.message(bundle.message || '');
    byId('support-result').hidden = !bundle.supportCode;
    if (byId('support-code').textContent !== (bundle.supportCode || '')) {
      byId('support-code').textContent = bundle.supportCode || '';
      delete byId('copy-support-code').dataset.copied;
      byId('copy-support-code').title = t('copy.code');
      byId('support-copy-feedback').textContent = '';
    }
    byId('bundle-download').hidden = !bundle.download;
    syncControls();
  }

  async function refreshDetails() {
    if (busy || detailsRefreshing) return;
    detailsRefreshing = true;
    const current = generation;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const token = await sessionToken(controller.signal);
      const response = await fetch('details.cgi', {credentials: 'same-origin', cache: 'no-store',
        headers: {'X-SYNO-TOKEN': token}, signal: controller.signal});
      if (!response.ok) throw new Error('Details unavailable');
      const data = await response.json();
      if (current !== generation || busy) return;
      if (data.ok && data.collecting) {
        bundle = data.bundle;
        renderBundle();
        byId('details-message').textContent = t('health.collecting');
        return;
      }
      if (data.ok && data.unavailable) {
        detailsAvailable = false;
        bundle = data.bundle || {};
        renderBundle();
        byId('details-message').textContent = t('health.daemonUnavailable');
        return;
      }
      if (!data.ok || !data.health || !Array.isArray(data.peers) || !Array.isArray(data.logs)) throw new Error('Invalid details');
      for (const name of ['management', 'signal']) {
        const source = data.health[name], element = byId('health-' + name);
        element.textContent = !source.reported ? t('status.notReported') : source.connected ? t('status.connected') : t('status.disconnected');
        element.dataset.health = source.connected ? 'good' : 'bad';
      }
      const relays = data.health.relays;
      const reachable = relays.filter(relay => relay.available).length;
      byId('health-relays').textContent = relays.length ? t('health.available',{available:ui.number(reachable),total:ui.number(relays.length)}) : t('status.notReported');
      byId('health-relays').dataset.health = reachable ? 'good' : 'bad';
      renderPeers(data.peers, data.peerTotal);
      logs = data.logs; filterLogs();
      debug = data.debug || {};
      bundle = data.bundle || {};
      detailsAvailable = true;
      byId('debug-state').textContent = debug.active ?
        t('debug.active',{time:ui.time(new Date(debug.expires * 1000))}) :
        t('debug.level',{level:data.logLevel});
      renderBundle();
      byId('details-message').textContent = t('status.updated',{time:ui.time(new Date())});
    } catch (error) {
      if (current !== generation || busy) return;
      detailsAvailable = false;
      byId('details-message').textContent = t('health.detailsUnavailable');
    } finally {
      clearTimeout(timer);
      detailsRefreshing = false;
      syncControls();
    }
  }

  byId('log-filter').addEventListener('change', filterLogs);
  byId('log-search').addEventListener('input', filterLogs);
  byId('debug-start').addEventListener('click', () => act({action: 'debug-start'}));
  byId('debug-stop').addEventListener('click', () => act({action: 'debug-stop'}));
  byId('bundle-create').addEventListener('click', () => {
    if (bundle.state === 'running') return;
    act({action: 'bundle-create', destination: document.querySelector('input[name="bundle-destination"]:checked').value});
  });
  byId('bundle-download').addEventListener('click', () => act({action: 'bundle-download', id: bundle.id}));
  function syncBundleDestination() {
    const destination=document.querySelector('input[name="bundle-destination"]:checked').value;
    const copy=ui.bundleCopy(ui.locale(),destination);
    byId('bundle-create').textContent=copy.button;
    byId('bundle-destination-note').textContent=copy.note;
  }
  for (const option of document.querySelectorAll('input[name="bundle-destination"]')) {
    option.addEventListener('change', syncBundleDestination);
  }
  syncBundleDestination();

  // Delegate so refreshed status cards keep their copy button working.
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('#copy-ip, #copy-support-code');
    if (!button || button.disabled) return;
    const support = button.id === 'copy-support-code';
    const value = support ? byId('support-code').textContent.trim() : byId('netbird-ip').textContent.trim().split('/')[0];
    const octets = value.split('.');
    if (!value || (!support && (octets.length !== 4 || octets.some((part) => !/^\d{1,3}$/.test(part) || Number(part) > 255)))) return;
    button.disabled = true;
    const feedback = byId(support ? 'support-copy-feedback' : 'copy-ip-feedback');
    feedback.textContent = '';
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        copied = true;
      }
    } catch (error) { /* Try the HTTP-compatible fallback. */ }
    let field;
    if (!copied) {
      field = document.createElement('input');
      field.type = 'text'; field.readOnly = true; field.value = value;
      field.setAttribute('aria-label', support ? t('copy.supportLabel') : t('copy.ipLabel'));
      feedback.appendChild(field); field.select();
      try { copied = document.execCommand('copy'); } catch (error) { /* Offer manual copy. */ }
    }
    button.disabled = false;
    if (copied) {
      button.dataset.copied = 'true'; button.title = t('copy.done');
      feedback.textContent = support ? t('copy.codeDone') : t('copy.ipDone'); button.focus();
    } else {
      feedback.insertBefore(document.createTextNode(support ? t('copy.manualCode') : t('copy.manualIP')), field);
      field.focus(); field.select();
    }
  });

  ui.onChange(() => { syncControls(); syncBundleDestination(); filterLogs(); refreshStatus(); });
  ui.apply();
  syncServerSelection();
  syncControls();
  filterLogs();
  refreshDetails();
  setInterval(refreshStatus, 10000);
})();
