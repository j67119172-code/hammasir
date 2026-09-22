// app/app.js
import * as Core from '../core/index.js';
import { api, tokens } from './api.js';

window.Core = Core;

const appEl = document.getElementById('app');
const stepEl = document.getElementById('step');
const footerEl = document.getElementById('footer');

const state = {
  user: null, route: null, car: null,
  group: null, members: [], messages: [],
  screen: 'loading',
  signup: { phone: '', code: '' },
};

window.__state = state;

function setStep(t) { if (stepEl) stepEl.textContent = t; }
function showFooter(v) { footerEl?.classList.toggle('hidden', !v); }
function scrollTop() { try { window.scrollTo(0, 0); } catch (_) {} }

function toast(msg) { alert(msg); }

async function callApi(fn, opts = {}) {
  try { return await fn(); }
  catch (err) {
    if (!opts.silent) toast(err.message || 'خطای غیرمنتظره');
    if (err.status === 401) { tokens.clear(); state.user = null; renderStart(); }
    return null;
  }
}

// ─── شروع ─────────────────────────────────────────────────
function renderStart() {
  state.screen = 'start';
  showFooter(false);
  setStep('شروع');
  appEl.innerHTML = `
    <section class="hero">
      <h1>هم‌مسیر مناسب خودت را پیدا کن</h1>
      <p>هماهنگی گروهی میان دارندگان خودرو برای مسیرهای رفت‌وبرگشت منظم.</p>
    </section>
    <div class="card">
      <div class="notice blue"><b>مدل خدمت:</b> فقط دارندگان خودرو می‌توانند حساب کامل بسازند.</div>
      <button class="btn" onclick="app.showLogin()">ورود</button>
      <button class="btn secondary" onclick="app.showSignup()">ثبت‌نام</button>
    </div>`;
}

// ─── ورود ─────────────────────────────────────────────────
function renderLogin() {
  state.screen = 'login';
  showFooter(false);
  setStep('ورود');
  appEl.innerHTML = `
    <button class="back" onclick="app.home()">←</button>
    <section class="hero"><h1>ورود</h1><p>نام کاربری و رمز عبور خود را وارد کنید.</p></section>
    <div class="card">
      <label>نام کاربری</label>
      <input id="lgUser" class="input" autocomplete="username">
      <label>رمز عبور</label>
      <input id="lgPass" class="input" type="password" autocomplete="current-password">
      <button class="btn" onclick="app.doLogin()">ورود</button>
    </div>`;
}

async function doLogin() {
  const username = document.getElementById('lgUser').value.trim();
  const password = document.getElementById('lgPass').value;
  if (!username || !password) return toast('همه فیلدها را پر کنید.');
  const res = await callApi(() => api.login(username, password));
  if (!res) return;
  tokens.set(res.accessToken, res.refreshToken);
  await bootstrap();
}

// ─── ثبت‌نام ──────────────────────────────────────────────
function renderSignup() {
  state.screen = 'signup';
  showFooter(false);
  setStep('ثبت‌نام');
  appEl.innerHTML = `
    <button class="back" onclick="app.home()">←</button>
    <section class="hero"><h1>ثبت‌نام</h1><p>گام ۱ از ۲ — شماره موبایل</p></section>
    <div class="card">
      <label>شماره موبایل</label>
      <div class="row">
        <input id="suPhone" class="input" style="flex:1" inputmode="numeric" maxlength="11" placeholder="09xxxxxxxxx">
        <button class="btn small secondary" style="margin:0" onclick="app.requestOtp()">ارسال کد</button>
      </div>
      <div id="otpBox"></div>
    </div>`;
}

async function requestOtp() {
  const phone = document.getElementById('suPhone').value.trim();
  if (!/^09\d{9}$/.test(phone)) return toast('شماره موبایل نامعتبر.');
  state.signup.phone = phone;
  const res = await callApi(() => api.requestOtp(phone));
  if (!res) return;
  document.getElementById('otpBox').innerHTML = `
    <div class="notice orange">کد ۶ رقمی پیامک شد.</div>
    <div class="otp">
      ${Array.from({ length: 6 }, (_, i) =>
        `<input id="o${i}" maxlength="1" inputmode="numeric" oninput="app.otpNext(${i})">`).join('')}
    </div>
    <button class="btn" onclick="app.continueSignup()">تأیید و ادامه</button>`;
}

function otpNext(i) {
  const el = document.getElementById('o' + i);
  el.value = Core.onlyDigits(el.value).slice(0, 1);
  if (el.value && i < 5) document.getElementById('o' + (i + 1)).focus();
}

function continueSignup() {
  let code = '';
  for (let i = 0; i < 6; i++) code += (document.getElementById('o' + i)?.value || '');
  if (code.length !== 6) return toast('کد ۶ رقمی کامل نیست.');
  state.signup.code = code;
  renderSignupProfile();
}

function renderSignupProfile() {
  state.screen = 'signup-profile';
  setStep('تکمیل پروفایل');
  appEl.innerHTML = `
    <button class="back" onclick="app.showSignup()">←</button>
    <section class="hero"><h1>تکمیل پروفایل</h1><p>گام ۲ از ۲</p></section>
    <div class="card">
      <label>نام کاربری (لاتین، با حرف شروع شود)</label>
      <input id="suUser" class="input" placeholder="ali_rezaei">
      <label>رمز عبور (حداقل ۸ کاراکتر، شامل حرف و عدد)</label>
      <input id="suPass" class="input" type="password">
      <label>نام و نام خانوادگی</label>
      <input id="suName" class="input" placeholder="علی رضایی">
      <label>جنسیت</label>
      <select id="suGender">
        <option value="">انتخاب کنید</option>
        <option value="male">آقا</option>
        <option value="female">خانم</option>
      </select>
      <label>سن</label>
      <input id="suAge" class="input" inputmode="numeric" maxlength="2">
      <button class="btn" onclick="app.finishSignup()">ثبت‌نام</button>
    </div>`;
}

async function finishSignup() {
  const payload = {
    username: document.getElementById('suUser').value.trim(),
    password: document.getElementById('suPass').value,
    phone: state.signup.phone,
    code: state.signup.code,
    name: document.getElementById('suName').value.trim(),
    gender: document.getElementById('suGender').value,
    age: Number(document.getElementById('suAge').value),
    sameGenderOnly: false,
    sameCarClassOnly: false,
  };
  if (!payload.username || !payload.password || !payload.name || !payload.gender || !payload.age)
    return toast('همه فیلدها را پر کنید.');
  const res = await callApi(() => api.signup(payload));
  if (!res) return;
  tokens.set(res.accessToken, res.refreshToken);
  await bootstrap();
}

// ─── خانه ─────────────────────────────────────────────────
async function renderHome() {
  state.screen = 'home';
  showFooter(true);
  setStep('خانه');
  activeNav('nHome');

  if (!state.user) {
    const me = await callApi(() => api.getMe(), { silent: true });
    if (!me) return renderStart();
    state.user = me.user; state.route = me.route; state.car = me.car;
  }

  const profileComplete = !!(state.route && state.car && state.user.name && state.user.gender && state.user.age);

  appEl.innerHTML = `
    <section class="hero"><h1>سلام ${Core.esc(state.user.name)}</h1>
      <p>روش تشکیل گروه را انتخاب کن.</p></section>
    ${!profileComplete ? `
      <div class="notice orange">
        <b>پروفایل شما ناقص است.</b> برای تشکیل گروه، ابتدا باید اطلاعات مسیر و خودرو را وارد کنید.
      </div>` : ''}
    <div class="card" onclick="app.completeProfile()">
      <h3>👤 پروفایل من</h3>
      <p>${state.car ? Core.esc(state.car.model) : 'خودرو ثبت نشده'} — ویرایش اطلاعات</p>
    </div>
    <div class="card" onclick="${profileComplete ? 'app.smartGroup()' : 'app.completeProfile()'}">
      <h3>🚙 دریافت پیشنهاد هم‌مسیر</h3>
      <p>${profileComplete
        ? 'سامانه نزدیک‌ترین افراد را بر اساس موقعیت، زمان و ظرفیت پیشنهاد می‌دهد.'
        : 'برای فعال شدن این دکمه، ابتدا پروفایل خود را تکمیل کنید.'
      }</p>
    </div>`;
}
function activeNav(id) {
  ['nHome', 'nGroup', 'nMsg', 'nProfile'].forEach(x => {
    document.getElementById(x)?.classList.toggle('active', x === id);
  });
}

// ─── تکمیل پروفایل ───────────────────────────────────────
function renderCompleteProfile() {
  state.screen = 'profile-edit';
  setStep('تکمیل پروفایل');
  appEl.innerHTML = `
    <button class="back" onclick="app.home()">←</button>
    <section class="hero"><h1>تکمیل پروفایل</h1><p>اطلاعات مسیر و خودرو</p></section>
    <div class="card">
      <h3>مبدأ</h3>
      <label>استان</label>
      <input id="oProv" class="input" value="${Core.esc(state.route?.origin?.province || 'تهران')}">
      <label>شهر</label>
      <input id="oCity" class="input" value="${Core.esc(state.route?.origin?.city || 'تهران')}">
      <label>محدوده / محله</label>
      <input id="oArea" class="input" value="${Core.esc(state.route?.origin?.area || '')}" placeholder="صادقیه">
      <label>نقطه سوار شدن</label>
      <input id="oPoint" class="input" value="${Core.esc(state.route?.origin?.point || '')}" placeholder="میدان صادقیه">

      <div class="sep"></div>
      <h3>مقصد</h3>
      <label>استان</label>
      <input id="dProv" class="input" value="${Core.esc(state.route?.destination?.province || 'تهران')}">
      <label>شهر</label>
      <input id="dCity" class="input" value="${Core.esc(state.route?.destination?.city || 'تهران')}">
      <label>محدوده / محله</label>
      <input id="dArea" class="input" value="${Core.esc(state.route?.destination?.area || '')}" placeholder="ونک">
      <label>نقطه پیاده شدن</label>
      <input id="dPoint" class="input" value="${Core.esc(state.route?.destination?.point || '')}" placeholder="میدان ونک">

      <div class="sep"></div>
      <h3>خودرو</h3>
      <label>مدل خودرو</label>
      <input id="carModel" class="input" value="${Core.esc(state.car?.model || '')}" placeholder="تارا">
      <label>پلاک (شماره اصلی)</label>
      <input id="plateBody" class="input" value="${Core.esc(state.car?.plateBody || '')}" placeholder="۱۲ب۳۴۵">
      <label>کد ایران</label>
      <input id="plateIran" class="input" value="${Core.esc(state.car?.plateIran || '')}" placeholder="۱۲">
      <label>ظرفیت</label>
      <select id="seats">
        <option value="1">۱ نفر</option>
        <option value="2">۲ نفر</option>
        <option value="3" selected>۳ نفر</option>
      </select>

      <button class="btn" onclick="app.saveProfile()">ذخیره</button>
    </div>`;
}

async function saveProfile() {
  const payload = {
    origin: {
      province: document.getElementById('oProv').value.trim(),
      city: document.getElementById('oCity').value.trim(),
      area: document.getElementById('oArea').value.trim() || 'نامشخص',
      point: document.getElementById('oPoint').value.trim(),
    },
    destination: {
      province: document.getElementById('dProv').value.trim(),
      city: document.getElementById('dCity').value.trim(),
      area: document.getElementById('dArea').value.trim() || 'نامشخص',
      point: document.getElementById('dPoint').value.trim(),
    },
    departWindow: { period: 'morning', start: '07:00', end: '07:30' },
    returnWindow: { period: 'afternoon', start: '05:00', end: '05:30' },
    car: {
      model: document.getElementById('carModel').value.trim(),
      plateIran: document.getElementById('plateIran').value.trim(),
      plateBody: document.getElementById('plateBody').value.trim(),
      seats: Number(document.getElementById('seats').value),
    },
  };
  const res = await callApi(() => api.updateMe(payload));
  if (!res) return;
  toast('پروفایل ذخیره شد.');
  state.user = null;
  renderHome();
}

// ─── تشکیل گروه ──────────────────────────────────────────
async function smartGroup() {
  const res = await callApi(() => api.createSmartGroup());
  if (!res) return;
  if (!res.ok) return toast(res.message || 'گروهی یافت نشد.');
  openGroup(res.groupId);
}

async function openGroup(groupId) {
  const data = await callApi(() => api.getGroup(groupId));
  if (!data) return;
  state.group = data.group;
  state.members = data.members;
  renderGroup();
}

function renderGroup() {
  state.screen = 'group';
  showFooter(true);
  activeNav('nGroup');
  setStep(`گروه ${Core.faNum(state.members.length)} نفره`);

  const membersHtml = state.members.map(m => `
    <div class="member">
      <div class="avatar">${m.photoUrl ? `<img src="${m.photoUrl}" style="width:100%;height:100%;object-fit:cover">` : '👤'}</div>
      <div class="meta">
        <b>${m.isMe ? 'شما' : Core.esc(m.name || 'عضو')}</b>
        <small>${Core.genderFa(m.gender)}${m.age ? ' • ' + Core.faNum(m.age) + ' ساله' : ''}${m.car ? ' • ' + Core.esc(m.car) : ''}</small>
      </div>
      <span class="badge ${m.response === 'accepted' ? 'ok' : 'pending'}">
        ${m.response === 'accepted' ? 'تأیید' : m.response === 'declined' ? 'رد' : 'منتظر'}
      </span>
    </div>`).join('');

  appEl.innerHTML = `
    <section class="hero"><h1>گروه من</h1>
      <p>وضعیت: ${state.group.status === 'active' ? 'فعال' : state.group.status === 'pending' ? 'در انتظار تأیید' : 'در حال تکمیل'}</p></section>
    <div class="card">${membersHtml}</div>
    <div class="card">
      <h3>ارتباط</h3>
      <button class="btn secondary" onclick="app.openMessages()">پیام‌های گروه</button>
      <button class="btn danger" onclick="app.leaveGroup()">ترک گروه</button>
    </div>`;
}

// ─── پیام‌ها ─────────────────────────────────────────────
async function openMessages() {
  if (!state.group) return toast('ابتدا گروه بساز.');
  const data = await callApi(() => api.getMessages(state.group.id));
  if (!data) return;
  state.messages = data.messages || [];
  state.screen = 'messages';
  showFooter(true);
  activeNav('nMsg');
  setStep('پیام‌ها');

  const msgs = state.messages.length
    ? state.messages.map(m => `
        <div class="member">
          <div class="avatar">💬</div>
          <div class="meta"><b>${Core.esc(m.sender_name || m.sender_label || 'سیستم')}</b>
            <small>${Core.esc(m.text)}</small></div>
        </div>`).join('')
    : '<div class="notice gray">هنوز پیامی نیست.</div>';

  appEl.innerHTML = `
    <button class="back" onclick="app.home()">←</button>
    <section class="hero"><h1>پیام‌ها</h1></section>
    <div class="card">${msgs}</div>
    <div class="card">
      <input id="msgInput" class="input" maxlength="300" placeholder="پیام...">
      <button class="btn" onclick="app.sendMessage()">ارسال</button>
    </div>`;
}

async function sendMessage() {
  const text = document.getElementById('msgInput').value.trim();
  if (!text || !state.group) return;
  await callApi(() => api.sendMessage(state.group.id, text));
  document.getElementById('msgInput').value = '';
  openMessages();
}

async function leaveGroup() {
  if (!state.group) return;
  if (!confirm('گروه را ترک می‌کنی؟')) return;
  await callApi(() => api.leaveGroup(state.group.id));
  state.group = null;
  renderHome();
}

// ─── پروفایل ─────────────────────────────────────────────
function renderProfile() {
  if (!state.user) return renderStart();
  state.screen = 'profile';
  showFooter(true);
  activeNav('nProfile');
  setStep('پروفایل');
  appEl.innerHTML = `
    <section class="hero"><h1>پروفایل من</h1></section>
    <div class="card">
      <div class="member">
        <div class="avatar">👤</div>
        <div class="meta"><b>${Core.esc(state.user.name)}</b>
          <small>@${Core.esc(state.user.username)} • ${Core.esc(state.user.phone)}</small></div>
      </div>
      <div class="sep"></div>
      <p><b>مبدأ:</b> ${Core.esc(state.route?.origin?.city || '—')} — ${Core.esc(state.route?.origin?.area || '')}</p>
      <p><b>مقصد:</b> ${Core.esc(state.route?.destination?.city || '—')} — ${Core.esc(state.route?.destination?.area || '')}</p>
      <p><b>خودرو:</b> ${Core.esc(state.car?.model || '—')}</p>
      <div class="sep"></div>
      <button class="btn secondary" onclick="app.completeProfile()">ویرایش پروفایل</button>
      <button class="btn ghost" onclick="app.logout()">خروج از حساب</button>
    </div>`;
}

function logout() {
  tokens.clear();
  state.user = null; state.route = null; state.car = null; state.group = null;
  renderStart();
}

// ─── ناوبری پایین ────────────────────────────────────────
function nav(section) {
  if (section === 'home') return renderHome();
  if (section === 'group') return state.group ? openGroup(state.group.id) : renderHome();
  if (section === 'msg') return state.group ? openMessages() : toast('ابتدا گروه بساز.');
  if (section === 'profile') return renderProfile();
}

// ─── Bootstrap ───────────────────────────────────────────
async function bootstrap() {
  if (!tokens.access) return renderStart();
  const me = await callApi(() => api.getMe(), { silent: true });
  if (!me) return renderStart();
  state.user = me.user; state.route = me.route; state.car = me.car;
  renderHome();
}

// ─── اتصال به window ─────────────────────────────────────
window.app = {
  home: renderStart,
  showLogin: renderLogin,
  doLogin,
  showSignup: renderSignup,
  requestOtp,
  otpNext,
  continueSignup,
  finishSignup,
  completeProfile: renderCompleteProfile,
  saveProfile,
  smartGroup,
  openGroup,
  openMessages,
  sendMessage,
  leaveGroup,
  nav,
  logout,
};

bootstrap();
