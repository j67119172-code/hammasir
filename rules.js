// core/rules.js
import {
  CFG, TRAFFIC_PARITY_CITIES, CAR_CLASS_INFO, CAR_MODEL_CLASS,
} from './constants.js';
import { onlyDigits } from './utils.js';

export function normalizeCarModel(v = '') {
  return String(v || '').trim().replace(/\s+/g, ' ');
}

export function carClassOf(model = '') {
  const m = normalizeCarModel(model);
  if (CAR_MODEL_CLASS[m]) return CAR_MODEL_CLASS[m];
  const s = m.toLowerCase();
  if (/(پراید|پیکان|تیبا|ساینا|کوییک|ماتیز|سیلو|ام وی ام 110)/iu.test(s)) return 'economy';
  if (/(206|۲۰۶|207|۲۰۷|رانا|ساندرو|h220|h230|h320|315|rio|ریو|i20|i30|مزدا\s*2)/iu.test(s)) return 'compact';
  if (/(شاسی|suv|کراس|هایما|تیگو|جک|kmc|x22|x33|x55|فیدلیتی|دیگنیتی|اسپورتیج|توسان|سانتافه|کپچر|داستر|جوک|ایکس تریل|راو4|پرادو|ویتارا|asx|اوتلندر)/iu.test(s)) return 'suv';
  return 'sedan';
}

export function carClassLabel(model = '') {
  return CAR_CLASS_INFO[carClassOf(model)]?.label || 'سدان';
}

export function plateParityFromBody(body) {
  const digits = onlyDigits(body);
  if (!digits) return '';
  return Number(digits.slice(-1)) % 2 === 0 ? 'even' : 'odd';
}

export function isTrafficParityCity(city) {
  return TRAFFIC_PARITY_CITIES.has(city);
}

export function trafficParityRule(members, originCity) {
  if (!isTrafficParityCity(originCity)) return { ok: true };
  const known = members.map(m => m.plateParity || plateParityFromBody(m.plateBody)).filter(Boolean);
  const e = known.filter(x => x === 'even').length;
  const o = known.filter(x => x === 'odd').length;
  if (known.length < members.length) return { ok: false, msg: 'اطلاعات زوج/فرد پلاک همه اعضا باید مشخص باشد.' };
  if (members.length === 4 && !(e === 2 && o === 2)) return { ok: false, msg: 'گروه ۴ نفره باید ۲ پلاک زوج و ۲ پلاک فرد باشد.' };
  if (members.length === 2 && !(e === 1 && o === 1)) return { ok: false, msg: 'گروه ۲ نفره نیاز به یک پلاک زوج و یک پلاک فرد دارد.' };
  if (members.length === 3 && Math.abs(e - o) > 1) return { ok: false, msg: 'توزیع پلاک باید متوازن باشد.' };
  return { ok: true };
}

export function femaleRule(members) {
  const females = members.filter(m => m.gender === 'female').length;
  return { ok: females !== 1, females };
}

export function memberGender(m, state) { return m?.id === 'me' ? state.gender : m?.gender; }
export function memberCar(m, state) { return m?.id === 'me' ? state.carModel : (m?.car || ''); }
export function memberSameGenderOnly(m, state) { return m?.id === 'me' ? !!state.sameGenderOnly : !!m?.sameGenderOnly; }
export function memberSameCarClassOnly(m, state) { return m?.id === 'me' ? !!state.sameCarClassOnly : !!m?.sameCarClassOnly; }

export function memberTime(m, prefix, state) {
  if (m?.id === 'me') return { period: state[prefix+'Period'], start: state[prefix+'Start'], end: state[prefix+'End'] };
  return {
    period: m?.[prefix+'Period'] || (prefix === 'depart' ? 'morning' : 'afternoon'),
    start: m?.[prefix+'Start'] || (prefix === 'depart' ? '07:00' : '05:00'),
    end: m?.[prefix+'End'] || (prefix === 'depart' ? '07:30' : '05:30'),
  };
}

export function parse12Clock(t) {
  const m = /^(0?[1-9]|1[0-2]):([0-5]\d)$/.exec(t || '');
  return m ? { h: +m[1], m: +m[2] } : null;
}

export function toAbsoluteMinutes(period, t) {
  const x = parse12Clock(t);
  if (!x) return NaN;
  let h = x.h;
  if (period === 'morning') { if (h === 12) h = 0; }
  else { if (h !== 12) h += 12; }
  return h * 60 + x.m;
}

export function overlapMinutes(a, b) {
  if (!a || !b || a.period !== b.period) return 0;
  const s = Math.max(toAbsoluteMinutes(a.period, a.start), toAbsoluteMinutes(b.period, b.start));
  const e = Math.min(toAbsoluteMinutes(a.period, a.end), toAbsoluteMinutes(b.period, b.end));
  return Number.isFinite(s) && Number.isFinite(e) ? Math.max(0, e - s) : 0;
}

export function display12(t) {
  const x = parse12Clock(t);
  return x ? `${x.h}:${String(x.m).padStart(2, '0')}` : '—';
}

export function timeCompatiblePair(a, b, state) {
  return overlapMinutes(memberTime(a,'depart',state), memberTime(b,'depart',state)) > 0
      && overlapMinutes(memberTime(a,'return',state), memberTime(b,'return',state)) > 0;
}

export function genderCompatiblePair(a, b, state) {
  if (!memberSameGenderOnly(a, state) && !memberSameGenderOnly(b, state)) return true;
  return memberGender(a, state) === memberGender(b, state);
}

export function carClassCompatiblePair(a, b, state) {
  if (!memberSameCarClassOnly(a, state) && !memberSameCarClassOnly(b, state)) return true;
  return carClassOf(memberCar(a, state)) === carClassOf(memberCar(b, state));
}

export function hardCompatiblePair(a, b, state) {
  return timeCompatiblePair(a, b, state)
      && genderCompatiblePair(a, b, state)
      && carClassCompatiblePair(a, b, state);
}

export function allPairwiseHardCompatible(members, state) {
  for (let i = 0; i < members.length; i++)
    for (let j = i + 1; j < members.length; j++)
      if (!hardCompatiblePair(members[i], members[j], state)) return false;
  return true;
}

export function targetGroupSize(state) {
  return Math.max(2, Math.min(CFG.maxGroup, 1 + Number(state.seats || CFG.maxSeats)));
}

export function effectiveInviteLimit(state) {
  return Math.max(1, Math.min(CFG.maxInvites, targetGroupSize(state) - 1));
          }
