// core/matching.test.js
import assert from 'node:assert/strict';
import {
  carClassAffinity, rankCandidatesForGroup,
  bestGroupCompletion, groupCombinationScore,
  makeSmartProposal, balancedParitySelection,
} from './matching.js';
import { effectiveDistanceKm } from './location.js';

let passed = 0;
function test(name, fn) {
  try { fn(); console.log('✅', name); passed++; }
  catch (e) { console.error('❌', name, '\n   ', e.message); process.exitCode = 1; }
}

const TEHRAN_STATE = {
  gender: 'male', carModel: 'تارا',
  sameGenderOnly: false, sameCarClassOnly: false,
  plateBody: '12ب346',
  originProvince: 'تهران', originCity: 'تهران',
  destinationProvince: 'تهران', destinationCity: 'تهران',
  departPeriod: 'morning', departStart: '07:00', departEnd: '07:30',
  returnPeriod: 'afternoon', returnStart: '05:00', returnEnd: '05:30',
  seats: '3',
};

function mkCandidate(id, opts = {}) {
  return {
    id,
    registered: true,
    groupingPaused: false,
    gender: opts.gender || 'male',
    car: opts.car || 'تارا',
    plateParity: opts.plateParity || 'odd',
    sameGenderOnly: opts.sameGenderOnly || false,
    sameCarClassOnly: opts.sameCarClassOnly || false,
    originCity: 'تهران', originProvince: 'تهران',
    destinationCity: 'تهران', destinationProvince: 'تهران',
    originDistanceKm: opts.od ?? 1.5,
    destinationDistanceKm: opts.dd ?? 0.5,
    departPeriod: 'morning', departStart: opts.ds || '07:00', departEnd: opts.de || '07:30',
    returnPeriod: 'afternoon', returnStart: opts.rs || '05:00', returnEnd: opts.re || '05:30',
  };
}

const POOL = [
  mkCandidate('c1', { car: 'تارا', plateParity: 'odd', od: 1.0, dd: 0.3 }),
  mkCandidate('c2', { car: 'پژو 206', plateParity: 'even', od: 1.5, dd: 0.5 }),
  mkCandidate('c3', { car: 'شاهین', plateParity: 'odd', od: 2.0, dd: 0.6 }),
  mkCandidate('c4', { car: 'دنا', plateParity: 'even', od: 0.8, dd: 0.2 }),
  mkCandidate('c5', { car: 'تیگو 7', plateParity: 'odd', od: 3.5, dd: 1.0 }),
];

test('rank: کاندید ناسازگار زمانی حذف می‌شود', () => {
  const bad = mkCandidate('bad', { ds: '10:00', de: '10:30', rs: '10:00', re: '10:30' });
  const ranked = rankCandidatesForGroup([], [bad, ...POOL], TEHRAN_STATE);
  assert.equal(ranked.find(c => c.id === 'bad'), undefined);
});

test('rank: کاندید groupingPaused حذف می‌شود', () => {
  const paused = { ...mkCandidate('paused'), groupingPaused: true };
  const ranked = rankCandidatesForGroup([], [paused, ...POOL], TEHRAN_STATE);
  assert.equal(ranked.find(c => c.id === 'paused'), undefined);
});

test('rank: کاندید rejected حذف می‌شود', () => {
  const ranked = rankCandidatesForGroup([], POOL, TEHRAN_STATE, ['c1']);
  assert.equal(ranked.find(c => c.id === 'c1'), undefined);
});

test('bestCompletion: ۳ نفر لازم، Pool کافی → ۳ pick', () => {
  const picks = bestGroupCompletion([], 3, POOL, TEHRAN_STATE);
  assert.equal(picks.length, 3);
});

test('bestCompletion: Pool خالی → خروجی خالی', () => {
  assert.deepEqual(bestGroupCompletion([], 3, [], TEHRAN_STATE), []);
});

test('groupCombinationScore: ساختار درست', () => {
  const r = groupCombinationScore([POOL[0], POOL[1]], [], TEHRAN_STATE);
  assert.ok(typeof r.distance === 'number');
  assert.ok(typeof r.classAffinity === 'number');
});

test('makeSmartProposal: طول خروجی = targetGroupSize', () => {
  const p = makeSmartProposal(POOL, TEHRAN_STATE);
  assert.equal(p.length, 4);
});

test('makeSmartProposal: عنصر اول me', () => {
  const p = makeSmartProposal(POOL, TEHRAN_STATE);
  assert.equal(p[0].id, 'me');
});

test('effectiveDistance: same city → فاصله محلی', () => {
  const c = mkCandidate('x', { od: 2.3 });
  assert.equal(effectiveDistanceKm(c, 'origin', TEHRAN_STATE), 2.3);
});

console.log(`\n${passed} تست با موفقیت انجام شد.`);
