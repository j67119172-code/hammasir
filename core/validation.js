// core/validation.js
import { CFG } from './constants.js';
import { normalizeDigits, onlyDigits, normalizePhone, faNum } from './utils.js';
import { parse12Clock, toAbsoluteMinutes } from './rules.js';

export function validatePhone(raw) {
  const v = normalizePhone(raw);
  const re = new RegExp('^09\\d{' + Math.max(0, CFG.phoneDigits - 2) + '}$');
  if (!re.test(v))
    return { ok: false, msg: `شماره موبایل باید ${faNum(CFG.phoneDigits)} رقم و با 09 شروع شود.` };
  if (new RegExp('^09(\\d)\\1{' + Math.max(1, CFG.phoneDigits - 3) + '}$').test(v))
    return { ok: false, msg: 'شماره با الگوی تکراری غیرواقعی پذیرفته نمی‌شود.' };
  return { ok: true, value: v };
}

export function validateName(raw) {
  const v = String(raw ?? '').replace(/\s+/g, ' ').trim();
  if (v.length < CFG.minName || v.length > CFG.maxName)
    return { ok: false, msg: `نام باید بین ${faNum(CFG.minName)} تا ${faNum(CFG.maxName)} کاراکتر باشد.` };
  if (/[0-9۰-۹٠-٩]/.test(v))
    return { ok: false, msg: 'نام نباید شامل عدد باشد.' };
  if (/[<>{}\[\]@#$%^&*_+=\\|\/~`]/.test(v))
    return { ok: false, msg: 'نام شامل کاراکتر غیرمجاز است.' };
  const parts = v.split(' ').filter(Boolean);
  if (parts.length < 2 || parts.some(x => x.length < 2))
    return { ok: false, msg: 'حداقل نام و نام خانوادگی معتبر وارد کنید.' };
  const isFa = /^[آ-یءئؤإأاۀة\s‌\-'.]+$/u.test(v);
  const isEn = /^[A-Za-z\s\-'.]+$/.test(v);
  if (!isFa && !isEn)
    return { ok: false, msg: 'نام را فقط با حروف فارسی یا لاتین وارد کنید.' };
  return { ok: true, value: v };
}

export function validateUsername(raw) {
  const v = String(raw ?? '').trim();
  if (v.length < CFG.minUsername || v.length > CFG.maxUsername
      || !/^[A-Za-z][A-Za-z0-9_.]*$/.test(v))
    return { ok: false, msg: `نام کاربری باید ${faNum(CFG.minUsername)} تا ${faNum(CFG.maxUsername)} کاراکتر باشد و با حرف لاتین شروع شود.` };
  return { ok: true, value: v };
}

export function validatePassword(v) {
  v = String(v ?? '');
  if (v.length < CFG.minPassword || v.length > CFG.maxPassword)
    return { ok: false, msg: `رمز عبور باید بین ${faNum(CFG.minPassword)} تا ${faNum(CFG.maxPassword)} کاراکتر باشد.` };
  if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v))
    return { ok: false, msg: 'رمز عبور باید حداقل یک حرف و یک عدد داشته باشد.' };
  return { ok: true, value: v };
}

export function validateBankCard(raw) {
  const v = onlyDigits(raw);
  if (v.length !== CFG.bankCardDigits)
    return { ok: false, msg: `شماره کارت باید ${faNum(CFG.bankCardDigits)} رقم باشد.` };
  if (/^(\d)\1+$/.test(v))
    return { ok: false, msg: 'شماره کارت نامعتبر است.' };
  return { ok: true, value: v };
}

export function validateIban(raw) {
  const v = normalizeDigits(String(raw ?? '').toUpperCase()).replace(/[\s-]/g, '');
  const re = new RegExp('^IR\\d{' + CFG.ibanDigits + '}$');
  if (!re.test(v))
    return { ok: false, msg: `شماره شبا باید با IR شروع شود و پس از آن ${faNum(CFG.ibanDigits)} رقم داشته باشد.` };
  if (new RegExp('^IR0{' + CFG.ibanDigits + '}$').test(v))
    return { ok: false, msg: 'شماره شبا نامعتبر است.' };
  return { ok: true, value: v };
}

export function validateLocation(raw, label) {
  const v = String(raw ?? '').replace(/\s+/g, ' ').trim();
  if (v.length < CFG.minLocation || v.length > CFG.maxLocation)
    return { ok: false, msg: `${label} باید بین ${faNum(CFG.minLocation)} تا ${faNum(CFG.maxLocation)} کاراکتر باشد.` };
  if (/[<>{}\[\]@$%^*_+=\\|~`]/.test(v))
    return { ok: false, msg: `${label} دارای کاراکتر نامعتبر است.` };
  if (/(پلاک\s*\d+|واحد\s*\d+|طبقه\s*\d+)/u.test(v))
    return { ok: false, msg: `برای ${label} نشانی دقیق وارد نکنید.` };
  return { ok: true, value: v };
}

export function validateArea(raw, label) {
  const v = String(raw ?? '').replace(/\s+/g, ' ').trim();
  if (v.length < 2 || v.length > 60)
    return { ok: false, msg: `${label} را به‌صورت محدوده یا محله وارد کنید.` };
  return { ok: true, value: v };
}

export function validateCarModel(raw) {
  const v = String(raw ?? '').replace(/\s+/g, ' ').trim();
  if (v.length < CFG.minCarModel || v.length > CFG.maxCarModel || !/[A-Za-zآ-ی]/u.test(v))
    return { ok: false, msg: `مدل خودرو باید بین ${faNum(CFG.minCarModel)} تا ${faNum(CFG.maxCarModel)} کاراکتر باشد.` };
  return { ok: true, value: v };
}

export function validatePlate(iranRaw, bodyRaw) {
  const iran = onlyDigits(iranRaw);
  const body = normalizeDigits(String(bodyRaw ?? '')).replace(/[\s\-]/g, '');
  if (iran.length !== CFG.plateIranDigits)
    return { ok: false, msg: `کد ایران پلاک باید ${faNum(CFG.plateIranDigits)} رقم باشد.` };
  const re = new RegExp(
    '^(\\d{' + CFG.plateLeftDigits + '})([آ-ی])(\\d{' + CFG.plateRightDigits + '})$',
    'u'
  );
  if (!re.test(body))
    return { ok: false, msg: `شماره اصلی پلاک نامعتبر است (مانند ۱۲ب۳۴۵).` };
  return { ok: true, iran, body };
}

export function validateTimeWindow(period, start, end, label) {
  const a = parse12Clock(start);
  const b = parse12Clock(end);
  if (!a || !b)
    return { ok: false, msg: `ابتدا و انتهای بازه ${label} را کامل انتخاب کنید.` };
  const s = toAbsoluteMinutes(period, start);
  const e = toAbsoluteMinutes(period, end);
  if (period === 'morning' && (s < 240 || e > 720))
    return { ok: false, msg: `برای ${label} «صبح»، ساعت باید بین ۴:۰۰ تا ۱۲:۰۰ باشد.` };
  if (period === 'afternoon' && (s < 720 || e > 1439))
    return { ok: false, msg: `برای ${label} «بعدازظهر»، ساعت را به قالب ۱۲ساعته وارد کنید.` };
  if (e <= s)
    return { ok: false, msg: `انتهای بازه ${label} باید بعد از ابتدای آن باشد.` };
  const dur = e - s;
  if (dur < CFG.minTimeWindowMinutes || dur > CFG.maxTimeWindowMinutes)
    return { ok: false, msg: `بازه ${label} باید بین ${faNum(CFG.minTimeWindowMinutes)} تا ${faNum(CFG.maxTimeWindowMinutes)} دقیقه باشد.` };
  return { ok: true, start: start.padStart(5, '0'), end: end.padStart(5, '0'), duration: dur };
}

export function validateAge(raw) {
  const n = Number(normalizeDigits(raw));
  if (!Number.isFinite(n) || n < CFG.minAge || n > CFG.maxAge)
    return { ok: false, msg: `سن باید بین ${faNum(CFG.minAge)} تا ${faNum(CFG.maxAge)} سال باشد.` };
  return { ok: true, value: String(n) };
}

export function validateSeats(raw) {
  const n = Number(normalizeDigits(raw));
  if (!Number.isInteger(n) || n < 1 || n > CFG.maxSeats)
    return { ok: false, msg: `ظرفیت خودرو باید بین ۱ تا ${faNum(CFG.maxSeats)} نفر باشد.` };
  return { ok: true, value: String(n) };
}
