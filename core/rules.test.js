// core/rules.test.js
import assert from 'node:assert/strict';
import {
  carClassOf, plateParityFromBody, femaleRule, trafficParityRule,
  hardCompatiblePair, overlapMinutes, targetGroupSize,
} from './rules.js';

let passed = 0;
function test(name, fn) {
  try { fn(); console.log('✅', name); passed++; }
  catch (e) { console.error('❌', name, '\n   ', e.message); process.exitCode = 1; }
}

test('carClassOf: پراید → economy', () =>
  assert.equal(carClassOf('پراید 131'), 'economy'));
test('carClassOf: پژو ۲۰۶ → compact', () =>
  assert.equal(carClassOf('پژو 206'), 'compact'));
test('carClassOf: تارا → sedan', () =>
  assert.equal(carClassOf('تارا'), 'sedan'));
test('carClassOf: تیگو ۷ → suv', () =>
  assert.equal(carClassOf('چری تیگو 7'), 'suv'));
test('carClassOf: ناشناخته → sedan', () =>
  assert.equal(carClassOf('ماشین عجیب'), 'sedan'));

test('plateParity: ...۵ → odd', () =>
  assert.equal(plateParityFromBody('12ب345'), 'odd'));
test('plateParity: ...۶ → even', () =>
  assert.equal(plateParityFromBody('12ب346'), 'even'));

test('femaleRule: ۱ خانم تنها → رد', () =>
  assert.equal(femaleRule([{gender:'male'},{gender:'female'}]).ok, false));
test('femaleRule: ۲ خانم + ۲ آقا → قبول', () =>
  assert.equal(femaleRule([{gender:'female'},{gender:'female'},{gender:'male'},{gender:'male'}]).ok, true));
test('femaleRule: بدون خانم → قبول', () =>
  assert.equal(femaleRule([{gender:'male'},{gender:'male'}]).ok, true));

test('parity: تهران، ۲نفره، ۱+۱ → قبول', () =>
  assert.equal(trafficParityRule([{plateParity:'even'},{plateParity:'odd'}], 'تهران').ok, true));
test('parity: تهران، ۲نفره، ۲+۰ → رد', () =>
  assert.equal(trafficParityRule([{plateParity:'even'},{plateParity:'even'}], 'تهران').ok, false));
test('parity: غیرتهران → بی‌اثر', () =>
  assert.equal(trafficParityRule([{plateParity:'even'},{plateParity:'even'}], 'اصفهان').ok, true));

test('overlap: 07:00-07:30 و 07:15-07:45 → ۱۵ دقیقه', () =>
  assert.equal(overlapMinutes(
    {period:'morning',start:'07:00',end:'07:30'},
    {period:'morning',start:'07:15',end:'07:45'}), 15));
test('overlap: دوره‌های متفاوت → ۰', () =>
  assert.equal(overlapMinutes(
    {period:'morning',start:'07:00',end:'07:30'},
    {period:'afternoon',start:'05:00',end:'05:30'}), 0));

test('targetGroupSize: ۳ صندلی → ۴ نفره', () =>
  assert.equal(targetGroupSize({ seats: '3' }), 4));
test('targetGroupSize: ۱ صندلی → ۲ نفره', () =>
  assert.equal(targetGroupSize({ seats: '1' }), 2));

const baseState = {
  sameGenderOnly: false, sameCarClassOnly: false,
  gender: 'male', carModel: 'تارا',
  departPeriod:'morning', departStart:'07:00', departEnd:'07:30',
  returnPeriod:'afternoon', returnStart:'05:00', returnEnd:'05:30',
};
test('hardPair: دو عضو سازگار', () => {
  const a = { id:'a', gender:'male', car:'پژو 206',
              departPeriod:'morning', departStart:'07:00', departEnd:'07:30',
              returnPeriod:'afternoon', returnStart:'05:00', returnEnd:'05:30' };
  const b = { id:'b', gender:'male', car:'تارا',
              departPeriod:'morning', departStart:'07:15', departEnd:'07:45',
              returnPeriod:'afternoon', returnStart:'05:15', returnEnd:'05:45' };
  assert.equal(hardCompatiblePair(a, b, baseState), true);
});

console.log(`\n${passed} تست با موفقیت انجام شد.`);
