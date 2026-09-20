// core/matching.js
import { CFG } from './constants.js';
import {
  carClassOf, memberCar,
  hardCompatiblePair, allPairwiseHardCompatible,
  femaleRule, trafficParityRule, targetGroupSize,
} from './rules.js';
import {
  pairDistanceKm, candidateGroupDistanceScore,
} from './location.js';

export function carClassAffinity(c, existing, state) {
  const k = carClassOf(memberCar(c, state));
  const me = {
    id: 'me', car: state.carModel, gender: state.gender,
    sameGenderOnly: !!state.sameGenderOnly, sameCarClassOnly: !!state.sameCarClassOnly,
  };
  const peers = existing.length ? existing : [me];
  const same = peers.filter(m => carClassOf(memberCar(m, state)) === k).length;
  return same / peers.length;
}

export function rankCandidatesForGroup(existing, list, state, rejected = []) {
  const excluded = new Set([...rejected, ...existing.map(m => m.id)]);
  const pool = list
    .filter(c => c.registered !== false)
    .filter(c => !c.groupingPaused)
    .filter(c => !excluded.has(c.id))
    .filter(c => existing.every(m => hardCompatiblePair(c, m, state)));

  return pool.sort((a, b) => {
    const da = candidateGroupDistanceScore(a, existing, state);
    const db = candidateGroupDistanceScore(b, existing, state);
    const diff = da - db;
    if (Math.abs(diff) > CFG.closeDistanceKm) return diff;
    const ca = carClassAffinity(a, existing, state);
    const cb = carClassAffinity(b, existing, state);
    if (cb !== ca) return cb - ca;
    return diff;
  });
}

export function groupCombinationScore(picks, existing, state) {
  const members = [...existing, ...picks];
  let d = 0, n = 0;
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      d += pairDistanceKm(members[i], members[j], 'origin', state)
         + pairDistanceKm(members[i], members[j], 'destination', state);
      n++;
    }
  }
  const avg = n ? d / n : 0;
  let matched = 0, total = 0;
  for (const p of picks) {
    for (const e of existing) {
      total++;
      if (carClassOf(memberCar(p, state)) === carClassOf(memberCar(e, state))) matched++;
    }
  }
  if (!total) {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        total++;
        if (carClassOf(memberCar(members[i], state)) === carClassOf(memberCar(members[j], state))) matched++;
      }
    }
  }
  return { distance: avg, classAffinity: total ? matched / total : 0 };
}

export function bestGroupCompletion(existing, missing, pool, state, rejected = []) {
  if (missing <= 0) return [];
  const ranked = rankCandidatesForGroup(existing, pool, state, rejected).slice(0, 28);
  const valid = [];

  function rec(start, pick) {
    if (pick.length === missing) {
      const all = [...existing, ...pick];
      if (!allPairwiseHardCompatible(all, state)) return;
      if (!femaleRule(all).ok) return;
      if (!trafficParityRule(all, state.originCity).ok) return;
      valid.push([...pick]);
      return;
    }
    for (let i = start; i < ranked.length; i++) {
      const next = [...pick, ranked[i]];
      const all = [...existing, ...next];
      if (allPairwiseHardCompatible(all, state)) rec(i + 1, next);
    }
  }
  rec(0, []);

  valid.sort((a, b) => {
    const A = groupCombinationScore(a, existing, state);
    const B = groupCombinationScore(b, existing, state);
    const diff = A.distance - B.distance;
    if (Math.abs(diff) > CFG.closeDistanceKm) return diff;
    if (B.classAffinity !== A.classAffinity) return B.classAffinity - A.classAffinity;
    return diff;
  });
  return valid[0] || [];
}

export function makeSmartProposal(pool, state, rejected = []) {
  const me = {
    id: 'me',
    name: state.name || 'شما',
    gender: state.gender,
    car: state.carModel,
    plateBody: state.plateBody,
    plateParity: (function(b) {
      const d = String(b || '').replace(/\D/g, '');
      return d ? (Number(d.slice(-1)) % 2 === 0 ? 'even' : 'odd') : '';
    })(state.plateBody),
    sameGenderOnly: !!state.sameGenderOnly,
    sameCarClassOnly: !!state.sameCarClassOnly,
    originProvince: state.originProvince, originCity: state.originCity,
    destinationProvince: state.destinationProvince, destinationCity: state.destinationCity,
    departPeriod: state.departPeriod, departStart: state.departStart, departEnd: state.departEnd,
    returnPeriod: state.returnPeriod, returnStart: state.returnStart, returnEnd: state.returnEnd,
  };
  const missing = targetGroupSize(state) - 1;
  const picks = bestGroupCompletion([me], missing, pool, state, rejected);
  return [me, ...picks];
}

export function balancedParitySelection(pool, needed, existing, state) {
  if (!state.originCity || state.originCity !== 'تهران' || needed <= 0) {
    return pool.slice(0, needed);
  }
  const finalSize = existing.length + needed;
  const evenTarget = Math.ceil(finalSize / 2);
  const oddTarget = Math.floor(finalSize / 2);
  let evenNow = existing.filter(m => (m.plateParity || '') === 'even').length;
  let oddNow = existing.filter(m => (m.plateParity || '') === 'odd').length;
  const picks = [];
  for (const parity of ['even', 'odd']) {
    const target = parity === 'even' ? evenTarget : oddTarget;
    const now = parity === 'even' ? evenNow : oddNow;
    let need = Math.max(0, target - now);
    for (const c of pool.filter(x => x.plateParity === parity)) {
      if (need <= 0 || picks.length >= needed) break;
      if (!picks.some(p => p.id === c.id)) { picks.push(c); need--; }
    }
  }
  for (const c of pool) {
    if (picks.length >= needed) break;
    if (!picks.some(p => p.id === c.id)) picks.push(c);
  }
  return picks.slice(0, needed);
                                                         }
