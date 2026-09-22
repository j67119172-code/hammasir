// server/src/services/matching.service.js
import { query } from '../config/db.js';
import { logger } from '../config/logger.js';
import { rankCandidatesForGroup, bestGroupCompletion, targetGroupSize } from '../../../core/index.js';

export async function loadCandidatePool(excludeUserIds = []) {
  const { rows } = await query(
    `SELECT
        u.id, u.name, u.gender, u.age, u.photo_url,
        u.same_gender_only, u.same_car_class_only, u.profile_notes,
        r.origin_province, r.origin_city, r.origin_region, r.origin_area, r.origin_point,
        r.destination_province, r.destination_city, r.destination_region, r.destination_area, r.destination_point,
        r.depart_period, r.depart_start, r.depart_end,
        r.return_period, r.return_start, r.return_end,
        r.days_going,
        c.car_model, c.car_class, c.plate_iran, c.plate_body, c.plate_parity, c.seats
      FROM users u
      JOIN user_routes r ON r.user_id = u.id AND r.is_active
      JOIN user_cars   c ON c.user_id = u.id AND c.is_active
      WHERE u.review_status = 'approved'
        AND u.grouping_paused = FALSE
        AND NOT (u.id = ANY($1::bigint[]))
      ORDER BY u.id`,
    [excludeUserIds]
  );
  return rows.map(rowToCandidate);
}

function rowToCandidate(r) {
  return {
    id: String(r.id),
    registered: true,
    groupingPaused: false,
    name: r.name,
    photo: r.photo_url,
    gender: r.gender,
    age: r.age,
    notes: r.profile_notes || '',
    car: r.car_model,
    carClass: r.car_class,
    plateIran: r.plate_iran,
    plateBody: r.plate_body,
    plateParity: r.plate_parity,
    seats: r.seats,
    sameGenderOnly: r.same_gender_only,
    sameCarClassOnly: r.same_car_class_only,
    daysGoing: r.days_going || [],
    originProvince: r.origin_province,
    originCity: r.origin_city,
    originRegion: r.origin_region,
    originArea: r.origin_area,
    originAddress: r.origin_point,
    originDistanceKm: 0,
    destinationProvince: r.destination_province,
    destinationCity: r.destination_city,
    destinationRegion: r.destination_region,
    destinationArea: r.destination_area,
    destinationAddress: r.destination_point,
    destinationDistanceKm: 0,
    departPeriod: r.depart_period,
    departStart: r.depart_start,
    departEnd: r.depart_end,
    returnPeriod: r.return_period,
    returnStart: r.return_start,
    returnEnd: r.return_end,
  };
}

export async function loadSelfAsMember(userId) {
  const { rows } = await query(
    `SELECT
        u.id, u.name, u.gender, u.age, u.photo_url,
        u.same_gender_only, u.same_car_class_only, u.profile_notes,
        r.origin_province, r.origin_city, r.origin_region, r.origin_area, r.origin_point,
        r.destination_province, r.destination_city, r.destination_region, r.destination_area, r.destination_point,
        r.depart_period, r.depart_start, r.depart_end,
        r.return_period, r.return_start, r.return_end,
        r.days_going,
        c.car_model, c.car_class, c.plate_iran, c.plate_body, c.plate_parity, c.seats
      FROM users u
      JOIN user_routes r ON r.user_id = u.id AND r.is_active
      JOIN user_cars   c ON c.user_id = u.id AND c.is_active
      WHERE u.id = $1 LIMIT 1`,
    [userId]
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: 'me',
    userId: r.id,
    name: r.name,
    photo: r.photo_url,
    gender: r.gender,
    age: r.age,
    notes: r.profile_notes || '',
    car: r.car_model,
    carClass: r.car_class,
    plateBody: r.plate_body,
    plateParity: r.plate_parity,
    seats: r.seats,
    sameGenderOnly: r.same_gender_only,
    sameCarClassOnly: r.same_car_class_only,
    daysGoing: r.days_going || [],
    originProvince: r.origin_province,
    originCity: r.origin_city,
    originRegion: r.origin_region,
    originAddress: r.origin_point,
    originDistanceKm: 0,
    destinationProvince: r.destination_province,
    destinationCity: r.destination_city,
    destinationRegion: r.destination_region,
    destinationAddress: r.destination_point,
    destinationDistanceKm: 0,
    departPeriod: r.depart_period,
    departStart: r.depart_start,
    departEnd: r.depart_end,
    returnPeriod: r.return_period,
    returnStart: r.return_start,
    returnEnd: r.return_end,
  };
}

export function memberToState(member) {
  return {
    gender: member.gender,
    carModel: member.car,
    sameGenderOnly: member.sameGenderOnly,
    sameCarClassOnly: member.sameCarClassOnly,
    plateBody: member.plateBody,
    daysGoing: member.daysGoing || [],
    originProvince: member.originProvince,
    originCity: member.originCity,
    destinationProvince: member.destinationProvince,
    destinationCity: member.destinationCity,
    departPeriod: member.departPeriod,
    departStart: member.departStart,
    departEnd: member.departEnd,
    returnPeriod: member.returnPeriod,
    returnStart: member.returnStart,
    returnEnd: member.returnEnd,
    seats: member.seats || '3',
  };
}

export async function bestGroupFor(userId, rejectedCandidateIds = []) {
  const me = await loadSelfAsMember(userId);
  if (!me) return { me: null, picks: [], size: 0, reason: 'PROFILE_INCOMPLETE' };

  const state = memberToState(me);
  const excludedIds = [userId, ...rejectedCandidateIds.map(Number).filter(Number.isFinite)];
  const pool = await loadCandidatePool(excludedIds);

  logger.debug({ userId, poolSize: pool.length }, 'candidate pool loaded');

  const desiredSize = targetGroupSize(state);
  const missing = desiredSize - 1;
  const picks = bestGroupCompletion([me], missing, pool, state, rejectedCandidateIds.map(String));

  return {
    me,
    picks,
    size: 1 + picks.length,
    targetSize: desiredSize,
    reason: picks.length === missing ? 'FULL' : picks.length === 0 ? 'NONE' : 'PARTIAL',
  };
    }
