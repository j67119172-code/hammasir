// core/utils.js
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function normalizeDigits(v) {
  return String(v ?? '')
    .replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d))
    .replace(/[٠-٩]/g, d => AR_DIGITS.indexOf(d));
}

export function onlyDigits(v) {
  return normalizeDigits(v).replace(/\D/g, '');
}

export function normalizePhone(v) {
  v = normalizeDigits(v).replace(/[\s\-()]/g, '');
  if (v.startsWith('+98')) v = '0' + v.slice(3);
  else if (v.startsWith('0098')) v = '0' + v.slice(4);
  else if (v.startsWith('98') && v.length === 12) v = '0' + v.slice(2);
  return v;
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, m =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
}

export function faNum(n) {
  return new Intl.NumberFormat('fa-IR').format(n);
}

export function money(n) {
  return faNum(n) + ' تومان';
}

export function normalizePersonName(name) {
  return String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .toLowerCase();
}

export function levenshteinDistance(a, b) {
  a = normalizePersonName(a);
  b = normalizePersonName(b);
  const n = a.length, m = b.length;
  if (!n) return m;
  if (!m) return n;
  let prev = Array.from({ length: m + 1 }, (_, j) => j);
  let cur = new Array(m + 1);
  for (let i = 1; i <= n; i++) {
    cur[0] = i;
    for (let j = 1; j <= m; j++) {
      cur[j] = Math.min(
        cur[j-1] + 1,
        prev[j] + 1,
        prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1)
      );
    }
    [prev, cur] = [cur, prev];
  }
  return prev[m];
}

export function personNameSimilarity(a, b) {
  const x = normalizePersonName(a);
  const y = normalizePersonName(b);
  const maxLen = Math.max(x.length, y.length);
  if (!maxLen) return 1;
  return Math.max(0, 1 - levenshteinDistance(x, y) / maxLen);
}

export const genderFa = g => g === 'female' ? 'خانم' : 'آقا';
export const periodFa = p => p === 'morning' ? 'صبح' : 'بعدازظهر';
export const parityFa = p => p === 'even' ? 'زوج' : p === 'odd' ? 'فرد' : 'نامشخص';
export const firstName = n => String(n || '').trim().split(/\s+/)[0] || 'عضو';
