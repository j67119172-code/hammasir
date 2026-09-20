// core/location.js
import { CITY_GEO, PROVINCE_GEO, CITY_CENTERS, IRAN_LOCATIONS } from './constants.js';
import { plateParityFromBody } from './rules.js';

export function provinceForCity(city = '') {
  if (!city) return '';
  for (const [province, cities] of Object.entries(IRAN_LOCATIONS))
    if (cities.includes(city)) return province;
  return '';
}

export function inferCityFromAddress(address = '') {
  const s = String(address || '');
  for (const cities of Object.values(IRAN_LOCATIONS)) {
    const hit = cities.find(city => s.includes(city));
    if (hit) return hit;
  }
  return '';
}

export function candidateCity(m, kind) {
  const key = kind === 'origin' ? 'originCity' : 'destinationCity';
  const addrKey = kind === 'origin' ? 'originAddress' : 'destinationAddress';
  return m?.[key] || inferCityFromAddress(m?.[addrKey]) || '';
}

export function candidateProvince(m, kind) {
  const key = kind === 'origin' ? 'originProvince' : 'destinationProvince';
  return m?.[key] || provinceForCity(candidateCity(m, kind)) || '';
}

export function haversineCoords(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return NaN;
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function locationCoords(city, province) {
  return CITY_GEO[city] || PROVINCE_GEO[province] || null;
}

export function effectiveDistanceKm(m, kind, state) {
  if (!m || m.id === 'me') return 0;
  const userCity = kind === 'origin' ? state.originCity : state.destinationCity;
  const userProvince = kind === 'origin' ? state.originProvince : state.destinationProvince;
  const memberCity = candidateCity(m, kind);
  const memberProvince = candidateProvince(m, kind);
  const raw = Number(kind === 'origin' ? m.originDistanceKm : m.destinationDistanceKm);

  if (userCity && memberCity && userCity === memberCity)
    return Number.isFinite(raw) && raw >= 0 ? raw : 0;

  if (userCity || memberCity || userProvince || memberProvince) {
    const d = haversineCoords(
      locationCoords(userCity, userProvince),
      locationCoords(memberCity, memberProvince)
    );
    if (Number.isFinite(d)) {
      if (userProvince && memberProvince && userProvince !== memberProvince) return Math.max(25, d);
      if (userCity && memberCity && userCity !== memberCity) return Math.max(12, d);
      return Math.max(12, d);
    }
    if (userProvince && memberProvince && userProvince !== memberProvince) return 80;
    if (userCity && memberCity && userCity !== memberCity) return 25;
  }
  return Number.isFinite(raw) && raw >= 0 ? raw : 99;
}

export function pairDistanceKm(a, b, kind, state) {
  if (a?.id === 'me') return effectiveDistanceKm(b, kind, state);
  if (b?.id === 'me') return effectiveDistanceKm(a, kind, state);
  const ac = candidateCity(a, kind), bc = candidateCity(b, kind);
  const ap = candidateProvince(a, kind), bp = candidateProvince(b, kind);
  if (ac && bc && ac !== bc) {
    const d = haversineCoords(locationCoords(ac, ap), locationCoords(bc, bp));
    if (Number.isFinite(d)) return Math.max(12, d);
  }
  if (ap && bp && ap !== bp) {
    const d = haversineCoords(locationCoords(ac, ap), locationCoords(bc, bp));
    if (Number.isFinite(d)) return Math.max(25, d);
    return 80;
  }
  const ar = Number(kind === 'origin' ? a?.originDistanceKm : a?.destinationDistanceKm);
  const br = Number(kind === 'origin' ? b?.originDistanceKm : b?.destinationDistanceKm);
  if (Number.isFinite(ar) && Number.isFinite(br)) return Math.max(0.2, Math.abs(ar - br));
  return 2;
}

export function candidateGroupDistanceScore(c, existing, state) {
  const me = {
    id: 'me', gender: state.gender, car: state.carModel,
    sameGenderOnly: !!state.sameGenderOnly, sameCarClassOnly: !!state.sameCarClassOnly,
    plateParity: plateParityFromBody(state.plateBody),
    originProvince: state.originProvince, originCity: state.originCity,
    destinationProvince: state.destinationProvince, destinationCity: state.destinationCity,
    departPeriod: state.departPeriod, departStart: state.departStart, departEnd: state.departEnd,
    returnPeriod: state.returnPeriod, returnStart: state.returnStart, returnEnd: state.returnEnd,
  };
  const peers = existing.length ? existing : [me];
  const totals = peers.map(m =>
    pairDistanceKm(c, m, 'origin', state) + pairDistanceKm(c, m, 'destination', state)
  );
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
  const worst = Math.max(...totals);
  return avg + 0.35 * worst;
}

export function cityCenter(city, fallbackLabel) {
  return CITY_CENTERS[city] || CITY_CENTERS[fallbackLabel] || { x: 50, y: 50 };
}
