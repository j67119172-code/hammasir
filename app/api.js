// app/api.js
const BASE_URL = window.HAMMASIR_API_URL || 'https://hammasir-1.onrender.com';

const TOKEN_KEY = 'hammasir_access';
const REFRESH_KEY = 'hammasir_refresh';

export const tokens = {
  get access() { return localStorage.getItem(TOKEN_KEY); },
  get refresh() { return localStorage.getItem(REFRESH_KEY); },
  set(access, refresh) {
    localStorage.setItem(TOKEN_KEY, access || '');
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

let refreshPromise = null;

async function refreshTokens() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const refresh = tokens.refresh;
    if (!refresh) throw new Error('NO_REFRESH');
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) { tokens.clear(); throw new Error('REFRESH_FAILED'); }
    const data = await res.json();
    tokens.set(data.accessToken, data.refreshToken);
    return data.accessToken;
  })().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

export async function request(path, { method = 'GET', body, auth = true, retry = true } = {}) {
  const headers = { 'Accept': 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && tokens.access) headers['Authorization'] = `Bearer ${tokens.access}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && retry && tokens.refresh) {
    try {
      await refreshTokens();
      return request(path, { method, body, auth, retry: false });
    } catch (_) { tokens.clear(); }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error?.message || `خطای سرور (${res.status})`);
    err.code = data?.error?.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  requestOtp: (phone) => request('/auth/request-otp', { method: 'POST', body: { phone }, auth: false }),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password }, auth: false }),
  getMe: () => request('/me'),
  updateMe: (payload) => request('/me', { method: 'PUT', body: payload }),
  togglePause: () => request('/me/pause', { method: 'POST' }),
  createSmartGroup: () => request('/groups/smart', { method: 'POST' }),
  getGroup: (id) => request(`/groups/${id}`),
  acceptGroup: (id) => request(`/groups/${id}/accept`, { method: 'POST' }),
  rejectGroup: (id) => request(`/groups/${id}/reject`, { method: 'POST' }),
  leaveGroup: (id) => request(`/groups/${id}/leave`, { method: 'POST' }),
  getPendingProposals: () => request('/proposals/pending'),
  getReplacements: () => request('/proposals/replacements'),
  getReplacementFlow: (flowId) => request(`/proposals/replacement/${flowId}`),
  castReplacementVote: (flowId, choice) =>
    request(`/proposals/replacement/${flowId}/vote`, { method: 'POST', body: { choice } }),
  candidateRespondToReplacement: (flowId, accept) =>
    request(`/proposals/replacement/${flowId}/candidate-respond`, { method: 'POST', body: { accept } }),
  getMessages: (groupId) => request(`/messages/${groupId}`),
  sendMessage: (groupId, text) => request(`/messages/${groupId}`, { method: 'POST', body: { text } }),
  initPayment: (purpose) => request('/payments/init', { method: 'POST', body: { purpose } }),
};
