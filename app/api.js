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
  photoPreview: null,
  daysGoing: [],
  mapOrigin: { x: null, y: null },
  mapDest:   { x: null, y: null },
  termsAccepted: false,
};

window.__state = state;

function setStep(t) { if (stepEl) stepEl.textContent = t; }
function showFooter(v) { footerEl?.classList.toggle('hidden', !v); }
function toast(msg) { alert(msg); }

async function callApi(fn, opts = {}) {
  try { return await fn(); }
  catch (err) {
    if (!opts.silent) toast(err.message || 'خطای غیرمنتظره');
    if (err.status === 401) { tokens.clear(); state.user = null; renderStart(); }
    return null;
  }
}

// ─── شروع ────────────────────────────────────────────────
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

// ─── ورود ────────────────────────────────────────────────
function renderLogin() {
  state.screen = 'login';
  showFooter(false);
  setStep('ورود');
  appEl.innerHTML = `
    <button class="back" onclick="app.home()">←</button>
    <section class="hero"><h1>ورود</h1></section>
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

// ─── ثبت‌نام ─────────────────────────────────────────────
function renderSignup() {
  state.screen = 'signup';
  showFooter(false);
  setStep('ثبت‌نام');
  appEl.innerHTML = `
    <button class="back" onclick="app.home()">←</button>
    <section class="hero"><h1>ثبت‌نام</h1><p>شماره موبایل</p></section>
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
  setStep('تکمیل ثبت‌نام');
  appEl.innerHTML = `
    <button class="back" onclick="app.showSignup()">←</button>
    <section class="hero"><h1>تکمیل ثبت‌نام</h1></section>
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

// ─── خانه ────────────────────────────────────────────────
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

  const profileComplete = !!(state.route && state.car && (state.route.daysGoing?.length > 0));

  appEl.innerHTML = `
    <section class="hero"><h1>سلام ${Core.esc(state.user.name)}</h1>
      <p>روش تشکیل گروه را انتخاب کن.</p></section>

    ${!profileComplete ? `
      <div class="notice orange">
        <b>پروفایل ناقص است.</b> برای تشکیل گروه، ابتدا اطلاعات مسیر، روزها و خودرو را وارد کنید.
      </div>` : ''}

    <div class="card" onclick="app.completeProfile()">
      <h3>👤 پروفایل من</h3>
      <p>${state.car ? Core.esc(state.car.model) : 'خودرو ثبت نشده'} — ویرایش اطلاعات</p>
    </div>

    ${profileComplete ? `
      <div class="card" onclick="app.smartGroup()">
        <h3>🚙 دریافت پیشنهاد هم‌مسیر</h3>
        <p>سامانه نزدیک‌ترین افراد را بر اساس موقعیت، زمان و روزها پیشنهاد می‌دهد.</p>
      </div>
    ` : `
      <div class="card" style="opacity:0.5;pointer-events:none">
        <h3>🚙 دریافت پیشنهاد هم‌مسیر</h3>
        <p>🔒 برای فعال شدن، ابتدا پروفایل را تکمیل کنید.</p>
      </div>
    `}`;
}

function activeNav(id) {
  ['nHome', 'nGroup', 'nMsg', 'nProfile'].forEach(x => {
    document.getElementById(x)?.classList.toggle('active', x === id);
  });
}

// ─── تکمیل پروفایل ──────────────────────────────────────
function renderCompleteProfile() {
  state.screen = 'profile-edit';
  setStep('تکمیل پروفایل');

  const LOC = Core.IRAN_LOCATIONS;
  const REG = Core.METRO_REGIONS;
  const CMC = Core.CAR_MODELS_BY_CLASS;
  const CCI = Core.CAR_CLASS_INFO;

  const r = state.route || {};
  const o = r.origin || {};
  const d = r.destination || {};
  const c = state.car || {};
  const u = state.user || {};

  state.daysGoing = r.daysGoing || [];
  state.mapOrigin = { x: o.mapX ?? null, y: o.mapY ?? null };
  state.mapDest   = { x: d.mapX ?? null, y: d.mapY ?? null };

  const provOpts = (sel) => '<option value="">انتخاب کنید</option>' +
    Object.keys(LOC).map(p => `<option value="${p}"${sel === p ? ' selected' : ''}>${p}</option>`).join('');

  const cityOpts = (prov, sel) => {
    const cities = LOC[prov] || [];
    return '<option value="">انتخاب کنید</option>' +
      cities.map(ci => `<option value="${ci}"${sel === ci ? ' selected' : ''}>${ci}</option>`).join('');
  };

  const regOpts = (city, sel) => {
    const regions = REG[city] || [];
    return '<option value="">مرکز شهر / بدون منطقه</option>' +
      regions.map(rg => `<option value="${rg}"${sel === rg ? ' selected' : ''}>${rg}</option>`).join('');
  };

  let carModelOpts = '<option value="">انتخاب مدل خودرو</option>';
  for (const [cls, models] of Object.entries(CMC)) {
    carModelOpts += `<optgroup label="${CCI[cls]?.label || cls}">` +
      models.map(m => `<option value="${m}"${c.model === m ? ' selected' : ''}>${m}</option>`).join('') +
      '</optgroup>';
  }

  let plateIranOpts = '<option value="">--</option>';
  for (let i = 10; i <= 99; i++) {
    plateIranOpts += `<option value="${i}"${c.plateIran === String(i) ? ' selected' : ''}>ایران ${Core.faNum(i)}</option>`;
  }

  const hoursOpts = (sel) => {
    let h = '';
    for (let i = 1; i <= 12; i++) {
      const v = String(i).padStart(2, '0');
      h += `<option value="${v}"${sel === v ? ' selected' : ''}>${Core.faNum(i)}</option>`;
    }
    return h;
  };

  const minsOpts = (sel) => {
    let h = '';
    for (let i = 0; i < 60; i += 5) {
      const v = String(i).padStart(2, '0');
      h += `<option value="${v}"${sel === v ? ' selected' : ''}>${v}</option>`;
    }
    return h;
  };

  const splitT = (t, dh, dm) => {
    if (!t) return { h: dh, m: dm };
    const [h, m] = String(t).split(':');
    return { h: (h || dh).padStart(2, '0'), m: (m || dm).padStart(2, '0') };
  };

  const dS = splitT(r.departWindow?.start, '07', '00');
  const dE = splitT(r.departWindow?.end, '07', '30');
  const rS = splitT(r.returnWindow?.start, '05', '00');
  const rE = splitT(r.returnWindow?.end, '05', '30');

  const seatsOpts = (sel) => {
    let h = '';
    for (let i = 1; i <= 3; i++) {
      h += `<option value="${i}"${Number(sel) === i ? ' selected' : ''}>${Core.faNum(i)} نفر</option>`;
    }
    return h;
  };

  const photoSrc = state.photoPreview || u.photoUrl || '';
  const photoHTML = photoSrc ? `<img src="${photoSrc}" alt="preview">` : '📷';

  const weekdays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

  const weekdayBtns = weekdays.map((name, i) =>
    `<button type="button" class="weekday-btn${state.daysGoing.includes(i) ? ' active' : ''}" data-day="${i}" onclick="app.toggleDay(${i}, this)">${name}</button>`
  ).join('');

  appEl.innerHTML = `
    <button class="back" onclick="app.home()">←</button>
    <section class="hero"><h1>پروفایل</h1><p>اطلاعات فردی، مسیر، روزها و خودرو</p></section>

    <div class="card">
      <h3>۱. مشخصات فردی</h3>
      <div class="upload">
        <div id="pv" class="photo">${photoHTML}</div>
        <button type="button" class="btn secondary" onclick="app.pickPhoto()">انتخاب / تغییر عکس</button>
        <input id="photoInput" type="file" accept="image/*" onchange="app.handlePhoto(this)">
      </div>
      <label>نام و نام خانوادگی</label>
      <input id="pfName" class="input" maxlength="60" value="${Core.esc(u.name || '')}">
      <label>سن</label>
      <input id="pfAge" class="input" inputmode="numeric" maxlength="2" value="${Core.esc(u.age || '')}">
      <label>جنسیت</label>
      <select id="pfGender" class="input">
        <option value="male"${u.gender === 'male' ? ' selected' : ''}>آقا</option>
        <option value="female"${u.gender === 'female' ? ' selected' : ''}>خانم</option>
      </select>
      <div class="check">
        <input id="pfSameG" type="checkbox"${u.sameGenderOnly ? ' checked' : ''}>
        <label for="pfSameG">فقط گروه هم‌جنس خودم</label>
      </div>
      <label>توضیحات برای هماهنگی گروه</label>
      <textarea id="pfNotes" class="input" maxlength="600">${Core.esc(u.profileNotes || '')}</textarea>
    </div>

    <div class="card">
      <h3>۲. روزهای هفته</h3>
      <p style="font-size:10px;color:#6b798c;margin-bottom:8px">روزهایی که سر کار می‌روید را انتخاب کنید.</p>
      <div class="weekday-grid">${weekdayBtns}</div>
      <div class="notice gray" style="font-size:9.5px">همه‌ی اعضای گروه باید دقیقاً همین روزها را داشته باشند.</div>
    </div>

    <div class="card">
      <h3>۳. مبدأ</h3>
      <label>استان</label>
      <select id="oProv" class="input" onchange="app.__syncCity('origin')">${provOpts(o.province)}</select>
      <label>شهر</label>
      <select id="oCity" class="input" onchange="app.__syncRegion('origin')">${cityOpts(o.province, o.city)}</select>
      <label>منطقه شهرداری</label>
      <select id="oRegion" class="input">${regOpts(o.city, o.region)}</select>
      <label>محدوده / محله</label>
      <input id="oArea" class="input" value="${Core.esc(o.area || '')}" placeholder="صادقیه">
      <label>نقطه سوار شدن (عمومی)</label>
      <input id="oPoint" class="input" value="${Core.esc(o.point || '')}" placeholder="میدان صادقیه">
      <label>لوکیشن روی نقشه</label>
      <div id="originMap" class="map-picker" data-kind="origin" onclick="app.mapClick(event,'origin')">
        <span id="originMarker" class="map-marker hidden"></span>
      </div>
    </div>

    <div class="card">
      <h3>۴. مقصد</h3>
      <label>استان</label>
      <select id="dProv" class="input" onchange="app.__syncCity('dest')">${provOpts(d.province)}</select>
      <label>شهر</label>
      <select id="dCity" class="input" onchange="app.__syncRegion('dest')">${cityOpts(d.province, d.city)}</select>
      <label>منطقه شهرداری</label>
      <select id="dRegion" class="input">${regOpts(d.city, d.region)}</select>
      <label>محدوده / محله</label>
      <input id="dArea" class="input" value="${Core.esc(d.area || '')}" placeholder="ونک">
      <label>نقطه پیاده شدن</label>
      <input id="dPoint" class="input" value="${Core.esc(d.point || '')}" placeholder="میدان ونک">
      <label>لوکیشن روی نقشه</label>
      <div id="destMap" class="map-picker" data-kind="dest" onclick="app.mapClick(event,'dest')">
        <span id="destMarker" class="map-marker hidden"></span>
      </div>
    </div>

    <div class="card">
      <h3>۵. بازه زمانی رفت</h3>
      <label>بخش روز</label>
      <select id="dPeriod" class="input">
        <option value="morning"${r.departWindow?.period === 'morning' ? ' selected' : ''}>صبح (AM)</option>
        <option value="afternoon"${r.departWindow?.period === 'afternoon' ? ' selected' : ''}>بعدازظهر / عصر (PM)</option>
      </select>
      <div class="grid2">
        <div>
          <label>شروع</label>
          <div class="timepick">
            <select id="dStartH" class="input">${hoursOpts(dS.h)}</select>
            <span>:</span>
            <select id="dStartM" class="input">${minsOpts(dS.m)}</select>
          </div>
        </div>
        <div>
          <label>پایان</label>
          <div class="timepick">
            <select id="dEndH" class="input">${hoursOpts(dE.h)}</select>
            <span>:</span>
            <select id="dEndM" class="input">${minsOpts(dE.m)}</select>
          </div>
        </div>
      </div>

      <h3 style="margin-top:16px">۶. بازه زمانی برگشت</h3>
      <label>بخش روز</label>
      <select id="rPeriod" class="input">
        <option value="morning"${r.returnWindow?.period === 'morning' ? ' selected' : ''}>صبح (AM)</option>
        <option value="afternoon"${r.returnWindow?.period === 'afternoon' ? ' selected' : ''}>بعدازظهر / عصر (PM)</option>
      </select>
      <div class="grid2">
        <div>
          <label>شروع</label>
          <div class="timepick">
            <select id="rStartH" class="input">${hoursOpts(rS.h)}</select>
            <span>:</span>
            <select id="rStartM" class="input">${minsOpts(rS.m)}</select>
          </div>
        </div>
        <div>
          <label>پایان</label>
          <div class="timepick">
            <select id="rEndH" class="input">${hoursOpts(rE.h)}</select>
            <span>:</span>
            <select id="rEndM" class="input">${minsOpts(rE.m)}</select>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>۷. خودرو</h3>
      <label>مدل خودرو</label>
      <select id="carModel" class="input">${carModelOpts}</select>
      <div class="check">
        <input id="pfSameC" type="checkbox"${u.sameCarClassOnly ? ' checked' : ''}>
        <label for="pfSameC">فقط با خودروهای هم‌کلاس خودم</label>
      </div>
      <div class="grid2">
        <div>
          <label>کد ایران</label>
          <select id="plateIran" class="input">${plateIranOpts}</select>
        </div>
        <div>
          <label>شماره پلاک</label>
          <input id="plateBody" class="input" value="${Core.esc(c.plateBody || '')}" placeholder="۱۲ب۳۴۵">
        </div>
      </div>
      <label>ظرفیت</label>
      <select id="seats" class="input">${seatsOpts(c.seats || 3)}</select>
    </div>

    <div class="card">
      <h3>۸. تأیید</h3>
      <div class="check">
        <input id="pfTerms" type="checkbox"${state.termsAccepted ? ' checked' : ''}>
        <label for="pfTerms">شرایط استفاده و حریم خصوصی را می‌پذیرم.</label>
      </div>
      <button class="btn" onclick="app.saveProfile()">ذخیره اطلاعات</button>
    </div>
  `;

  // نمایش مارکرهای قبلی
  if (state.mapOrigin.x != null) showMarker('origin', state.mapOrigin.x, state.mapOrigin.y);
  if (state.mapDest.x != null) showMarker('dest', state.mapDest.x, state.mapDest.y);
}

// ─── توابع کمکی فرم ─────────────────────────────────────
function __syncCity(kind) {
  const LOC = Core.IRAN_LOCATIONS;
  const isOrig = kind === 'origin';
  const provEl = document.getElementById(isOrig ? 'oProv' : 'dProv');
  const cityEl = document.getElementById(isOrig ? 'oCity' : 'dCity');
  const regionEl = document.getElementById(isOrig ? 'oRegion' : 'dRegion');
  const cities = LOC[provEl.value] || [];
  cityEl.innerHTML = '<option value="">انتخاب کنید</option>' +
    cities.map(c => `<option value="${c}">${c}</option>`).join('');
  regionEl.innerHTML = '<option value="">مرکز شهر / بدون منطقه</option>';
}

function __syncRegion(kind) {
  const REG = Core.METRO_REGIONS;
  const isOrig = kind === 'origin';
  const cityEl = document.getElementById(isOrig ? 'oCity' : 'dCity');
  const regionEl = document.getElementById(isOrig ? 'oRegion' : 'dRegion');
  const regions = REG[cityEl.value] || [];
  regionEl.innerHTML = '<option value="">مرکز شهر / بدون منطقه</option>' +
    regions.map(r => `<option value="${r}">${r}</option>`).join('');
}

function toggleDay(day, btn) {
  const idx = state.daysGoing.indexOf(day);
  if (idx >= 0) {
    state.daysGoing.splice(idx, 1);
    btn.classList.remove('active');
  } else {
    state.daysGoing.push(day);
    state.daysGoing.sort((a, b) => a - b);
    btn.classList.add('active');
  }
}

function pickPhoto() {
  document.getElementById('photoInput')?.click();
}

function handlePhoto(input) {
  const f = input?.files?.[0];
  if (!f) return;
  if (!/^image\//.test(f.type || '')) return toast('فقط تصویر مجاز است.');
  if (f.size > 5 * 1024 * 1024) return toast('حجم عکس نباید بیشتر از ۵ مگابایت باشد.');

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxSize = 400;
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        const ratio = Math.min(maxSize / w, maxSize / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      state.photoPreview = dataUrl;
      const pv = document.getElementById('pv');
      if (pv) pv.innerHTML = `<img src="${dataUrl}" alt="preview">`;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(f);
}

function showMarker(kind, x, y) {
  const marker = document.getElementById(kind + 'Marker');
  if (!marker) return;
  marker.classList.remove('hidden');
  marker.style.left = x + '%';
  marker.style.top = y + '%';
}

function mapClick(ev, kind) {
  const map = document.getElementById(kind === 'origin' ? 'originMap' : 'destMap');
  if (!map) return;
  const rect = map.getBoundingClientRect();
  const x = Math.max(1, Math.min(99, ((ev.clientX - rect.left) / rect.width) * 100));
  const y = Math.max(5, Math.min(98, ((ev.clientY - rect.top) / rect.height) * 100));
  const pt = { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  if (kind === 'origin') state.mapOrigin = pt;
  else state.mapDest = pt;
  showMarker(kind, pt.x, pt.y);
}

async function saveProfile() {
  const gv = id => document.getElementById(id)?.value?.trim() || '';
  const gk = id => document.getElementById(id)?.checked || false;

  const name = gv('pfName');
  const age = Number(gv('pfAge'));
  if (name.length < 5) return toast('نام و نام خانوادگی را کامل وارد کنید.');
  if (!Number.isFinite(age) || age < 18 || age > 80) return toast('سن باید بین ۱۸ تا ۸۰ باشد.');
  if (state.daysGoing.length === 0) return toast('حداقل یک روز هفته را انتخاب کنید.');
  if (!gv('oProv') || !gv('oCity')) return toast('استان و شهر مبدأ را انتخاب کنید.');
  if (!gv('dProv') || !gv('dCity')) return toast('استان و شهر مقصد را انتخاب کنید.');
  if (!gv('carModel')) return toast('مدل خودرو را انتخاب کنید.');
  if (!gv('plateIran')) return toast('کد ایران پلاک را انتخاب کنید.');
  if (!/^\d{2}[آ-ی]\d{3}$/u.test(gv('plateBody'))) return toast('شماره پلاک نامعتبر (مثال: ۱۲ب۳۴۵).');
  if (!gk('pfTerms')) return toast('پذیرش شرایط استفاده الزامی است.');

  const payload = {
    name,
    age,
    gender: gv('pfGender'),
    sameGenderOnly: gk('pfSameG'),
    sameCarClassOnly: gk('pfSameC'),
    profileNotes: gv('pfNotes'),
    daysGoing: state.daysGoing,
    origin: {
      province: gv('oProv'), city: gv('oCity'),
      region: gv('oRegion') || null,
      area: gv('oArea') || 'نامشخص',
      point: gv('oPoint') || 'نامشخص',
      mapX: state.mapOrigin.x, mapY: state.mapOrigin.y,
    },
    destination: {
      province: gv('dProv'), city: gv('dCity'),
      region: gv('dRegion') || null,
      area: gv('dArea') || 'نامشخص',
      point: gv('dPoint') || 'نامشخص',
      mapX: state.mapDest.x, mapY: state.mapDest.y,
    },
    departWindow: {
      period: gv('dPeriod'),
      start: gv('dStartH') + ':' + gv('dStartM'),
      end:   gv('dEndH')   + ':' + gv('dEndM'),
    },
    returnWindow: {
      period: gv('rPeriod'),
      start: gv('rStartH') + ':' + gv('rStartM'),
      end:   gv('rEndH')   + ':' + gv('rEndM'),
    },
    car: {
      model: gv('carModel'),
      plateIran: gv('plateIran'),
      plateBody: gv('plateBody'),
      seats: Number(gv('seats')),
    },
  };

  if (state.photoPreview) payload.photoUrl = state.photoPreview;

  const res = await callApi(() => api.updateMe(payload));
  if (!res) return;

  toast('اطلاعات ذخیره شد.');
  state.photoPreview = null;
  state.user = null;
  renderHome();
}

// ─── گروه ────────────────────────────────────────────────
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
      <p>${state.group.status === 'active' ? 'فعال' : state.group.status === 'pending' ? 'در انتظار تأیید' : 'در حال تکمیل'}</p></section>
    <div class="card">${membersHtml}</div>
    <div class="card">
      <button class="btn secondary" onclick="app.openMessages()">پیام‌های گروه</button>
      <button class="btn danger" onclick="app.leaveGroup()">ترک گروه</button>
    </div>`;
}

async function openMessages() {
  if (!state.group) return toast('ابتدا گروه بساز.');
  const data = await callApi(() => api.getMessages(state.group.id));
  if (!data) return;
  state.messages = data.messages || [];
  setStep('پیام‌ها');
  activeNav('nMsg');
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
  const days = state.route?.daysGoing || [];
  const weekdays = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
  const daysText = days.length ? days.map(d => weekdays[d]).join('، ') : 'ثبت نشده';
  appEl.innerHTML = `
    <section class="hero"><h1>پروفایل من</h1></section>
    <div class="card">
      <div class="member">
        <div class="avatar">${state.user.photoUrl ? `<img src="${state.user.photoUrl}" style="width:100%;height:100%;object-fit:cover">` : '👤'}</div>
        <div class="meta"><b>${Core.esc(state.user.name)}</b>
          <small>@${Core.esc(state.user.username)} • ${Core.esc(state.user.phone)}</small></div>
      </div>
      <div class="sep"></div>
      <p><b>مبدأ:</b> ${Core.esc(state.route?.origin?.city || '—')} — ${Core.esc(state.route?.origin?.area || '')}</p>
      <p><b>مقصد:</b> ${Core.esc(state.route?.destination?.city || '—')} — ${Core.esc(state.route?.destination?.area || '')}</p>
      <p><b>روزها:</b> ${Core.esc(daysText)}</p>
      <p><b>خودرو:</b> ${Core.esc(state.car?.model || '—')}</p>
      <div class="sep"></div>
      <button class="btn secondary" onclick="app.completeProfile()">ویرایش پروفایل</button>
      <button class="btn ghost" onclick="app.logout()">خروج</button>
    </div>`;
}

function logout() {
  tokens.clear();
  state.user = null; state.route = null; state.car = null; state.group = null;
  renderStart();
}

function nav(section) {
  if (section === 'home') return renderHome();
  if (section === 'group') return state.group ? openGroup(state.group.id) : renderHome();
  if (section === 'msg') return state.group ? openMessages() : toast('ابتدا گروه بساز.');
  if (section === 'profile') return renderProfile();
}

async function bootstrap() {
  if (!tokens.access) return renderStart();
  const me = await callApi(() => api.getMe(), { silent: true });
  if (!me) return renderStart();
  state.user = me.user; state.route = me.route; state.car = me.car;
  renderHome();
}

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
  __syncCity,
  __syncRegion,
  toggleDay,
  pickPhoto,
  handlePhoto,
  mapClick,
  smartGroup,
  openGroup,
  openMessages,
  sendMessage,
  leaveGroup,
  nav,
  logout,
};

bootstrap();
