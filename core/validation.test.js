// core/validation.test.js
import assert from 'node:assert/strict';
import {
  validatePhone, validateName, validateUsername, validatePassword,
  validateBankCard, validateIban, validatePlate, validateTimeWindow,
  validateAge, validateSeats,
} from './validation.js';

let passed = 0;
function test(name, fn) {
  try { fn(); console.log('✅', name); passed++; }
  catch (e) { console.error('❌', name, '\n   ', e.message); process.exitCode = 1; }
}

test('phone: 09123456789 معتبر', () =>
  assert.equal(validatePhone('09123456789').ok, true));
test('phone: +98 912 345 6789 → 09123456789', () =>
  assert.equal(validatePhone('+98 912 345 6789').value, '09123456789'));
test('phone: ۰۹۱۲۳۴۵۶۷۸۹ فارسی معتبر', () =>
  assert.equal(validatePhone('۰۹۱۲۳۴۵۶۷۸۹').ok, true));
test('phone: 09111111111 رد', () =>
  assert.equal(validatePhone('09111111111').ok, false));

test('name: "علی رضایی" معتبر', () =>
  assert.equal(validateName('علی رضایی').ok, true));
test('name: "علی" تک‌کلمه رد', () =>
  assert.equal(validateName('علی').ok, false));
test('name: شامل عدد رد', () =>
  assert.equal(validateName('علی 123').ok, false));

test('username: ali_rezaei معتبر', () =>
  assert.equal(validateUsername('ali_rezaei').ok, true));
test('username: شروع با عدد رد', () =>
  assert.equal(validateUsername('1ali').ok, false));

test('password: abc12345 معتبر', () =>
  assert.equal(validatePassword('abc12345').ok, true));
test('password: فقط حرف رد', () =>
  assert.equal(validatePassword('abcdefgh').ok, false));

test('bankCard: 16 رقم معتبر', () =>
  assert.equal(validateBankCard('6274123456789012').ok, true));
test('bankCard: همه صفر رد', () =>
  assert.equal(validateBankCard('0000000000000000').ok, false));

test('iban: IR + 24 رقم معتبر', () =>
  assert.equal(validateIban('IR123456789012345678901234').ok, true));

test('plate: ایران 12 + ب345 معتبر', () => {
  const r = validatePlate('12', 'ب345');
  assert.equal(r.ok, true);
});

test('timeWindow: صبح 07:00-07:30 معتبر', () =>
  assert.equal(validateTimeWindow('morning','07:00','07:30','رفت').ok, true));
test('timeWindow: بازه ۳ دقیقه رد', () =>
  assert.equal(validateTimeWindow('morning','07:00','07:03','رفت').ok, false));
test('timeWindow: بعدازظهر 05:00-05:30 معتبر', () =>
  assert.equal(validateTimeWindow('afternoon','05:00','05:30','برگشت').ok, true));

test('age: 25 معتبر', () => assert.equal(validateAge(25).ok, true));
test('age: 10 رد', () => assert.equal(validateAge(10).ok, false));

test('seats: 3 معتبر', () => assert.equal(validateSeats(3).ok, true));
test('seats: 5 رد', () => assert.equal(validateSeats(5).ok, false));

console.log(`\n${passed} تست با موفقیت انجام شد.`);
