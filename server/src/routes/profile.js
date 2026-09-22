// server/src/routes/profile.js
import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, notFound } from '../middleware/errors.js';
import { carClassOf, plateParityFromBody } from '../../../core/index.js';

export const profileRouter = Router();
profileRouter.use(requireAuth);

// ─── Schema ها ───────────────────────────────────────────

const plateBodyRegex = /^\d{2}[آ-ی]\d{3}$/u;
const timeRegex = /^(0?[1-9]|1[0-2]):[0-5]\d$/;

const TimeWindowSchema = z.object({
  period: z.enum(['morning', 'afternoon']),
  start: z.string().regex(timeRegex),
  end: z.string().regex(timeRegex),
});

const RoutePointSchema = z.object({
  province: z.string().min(1).max(60),
  city: z.string().min(1).max(60),
  region: z.string().max(30).nullable().optional(),
  area: z.string().min(2).max(60),
  point: z.string().min(4).max(120),
  mapX: z.number().min(0).max(100).nullable().optional(),
  mapY: z.number().min(0).max(100).nullable().optional(),
});

const WeekdaysSchema = z.array(z.number().int().min(0).max(6)).max(7);

const UpdateProfileSchema = z.object({
  name: z.string().min(5).max(60).optional(),
  gender: z.enum(['male', 'female']).optional(),
  age: z.number().int().min(18).max(80).optional(),
  photoUrl: z.string().max(900000).nullable().optional(),
  profileNotes: z.string().max(600).optional(),
  sameGenderOnly: z.boolean().optional(),
  sameCarClassOnly: z.boolean().optional(),
  daysGoing: WeekdaysSchema.optional(),
  origin: RoutePointSchema.optional(),
  destination: RoutePointSchema.optional(),
  departWindow: TimeWindowSchema.optional(),
  returnWindow: TimeWindowSchema.optional(),
  car: z.object({
    model: z.string().min(2).max(50),
    plateIran: z.string().regex(/^\d{2}$/),
    plateBody: z.string().regex(plateBodyRegex),
    seats: z.number().int().min(1).max(3),
  }).optional(),
});

// ─── GET /me ─────────────────────────────────────────────

profileRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [userRes, routeRes, carRes, bankRes] = await Promise.all([
      query(
        `SELECT id, username, phone, phone_verified,
                name, gender, age, photo_url, profile_notes,
                same_gender_only, same_car_class_only, grouping_paused,
                review_status, review_message,
                created_at, updated_at
           FROM users WHERE id = $1`,
        [userId]
      ),
      query(`SELECT * FROM user_routes WHERE user_id = $1 AND is_active LIMIT 1`, [userId]),
      query(`SELECT * FROM user_cars WHERE user_id = $1 AND is_active LIMIT 1`, [userId]),
      query(
        `SELECT id, bank_card, iban, verified_at
           FROM user_bank_accounts
          WHERE user_id = $1 AND is_default LIMIT 1`,
        [userId]
      ),
    ]);

    if (!userRes.rows[0]) throw notFound('USER_NOT_FOUND', 'کاربر یافت نشد.');

    const u = userRes.rows[0];
    const r = routeRes.rows[0];
    const c = carRes.rows[0];
    const b = bankRes.rows[0];

    res.json({
      user: {
        id: u.id,
        username: u.username,
        phone: u.phone,
        phoneVerified: u.phone_verified,
        name: u.name,
        gender: u.gender,
        age: u.age,
        photoUrl: u.photo_url,
        profileNotes: u.profile_notes,
        sameGenderOnly: u.same_gender_only,
        sameCarClassOnly: u.same_car_class_only,
        groupingPaused: u.grouping_paused,
        reviewStatus: u.review_status,
        reviewMessage: u.review_message,
      },
      route: r ? {
        origin: {
          province: r.origin_province, city: r.origin_city,
          region: r.origin_region, area: r.origin_area,
          point: r.origin_point, mapX: r.origin_map_x, mapY: r.origin_map_y,
        },
        destination: {
          province: r.destination_province, city: r.destination_city,
          region: r.destination_region, area: r.destination_area,
          point: r.destination_point, mapX: r.destination_map_x, mapY: r.destination_map_y,
        },
        departWindow: { period: r.depart_period, start: r.depart_start, end: r.depart_end },
        returnWindow: { period: r.return_period, start: r.return_start, end: r.return_end },
        daysGoing: r.days_going || [],
      } : null,
      car: c ? {
        model: c.car_model, carClass: c.car_class,
        plateIran: c.plate_iran, plateBody: c.plate_body,
        plateParity: c.plate_parity, seats: c.seats,
      } : null,
      bank: b ? { card: b.bank_card, iban: b.iban } : null,
    });
  })
);

// ─── PUT /me ─────────────────────────────────────────────

profileRouter.put(
  '/',
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = UpdateProfileSchema.parse(req.body);

    await withTransaction(async (client) => {
      // ─── ۱. users ───
      const userFields = [];
      const userValues = [];
      let p = 1;

      if (data.name !== undefined) { userFields.push(`name = $${p++}`); userValues.push(data.name); }
      if (data.gender !== undefined) { userFields.push(`gender = $${p++}`); userValues.push(data.gender); }
      if (data.age !== undefined) { userFields.push(`age = $${p++}`); userValues.push(data.age); }
      if (data.photoUrl !== undefined) { userFields.push(`photo_url = $${p++}`); userValues.push(data.photoUrl); }
      if (data.profileNotes !== undefined) { userFields.push(`profile_notes = $${p++}`); userValues.push(data.profileNotes); }
      if (data.sameGenderOnly !== undefined) { userFields.push(`same_gender_only = $${p++}`); userValues.push(data.sameGenderOnly); }
      if (data.sameCarClassOnly !== undefined) { userFields.push(`same_car_class_only = $${p++}`); userValues.push(data.sameCarClassOnly); }

      if (userFields.length > 0) {
        userFields.push(`updated_at = now()`);
        userValues.push(userId);
        await client.query(
          `UPDATE users SET ${userFields.join(', ')} WHERE id = $${p}`,
          userValues
        );
      }

      // ─── ۲. routes ───
      if (data.origin || data.destination || data.departWindow || data.returnWindow || data.daysGoing) {
        await client.query(`UPDATE user_routes SET is_active = FALSE WHERE user_id = $1 AND is_active`, [userId]);

        const { rows: prev } = await client.query(
          `SELECT * FROM user_routes WHERE user_id = $1 ORDER BY id DESC LIMIT 1`, [userId]
        );
        const old = prev[0] || {};
        const o = data.origin, d = data.destination;
        const dw = data.departWindow, rw = data.returnWindow;

        await client.query(
          `INSERT INTO user_routes (
             user_id,
             origin_province, origin_city, origin_region, origin_area, origin_point,
             origin_map_x, origin_map_y,
             destination_province, destination_city, destination_region, destination_area, destination_point,
             destination_map_x, destination_map_y,
             depart_period, depart_start, depart_end,
             return_period, return_start, return_end,
             days_going,
             is_active
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,TRUE)`,
          [
            userId,
            o?.province ?? old.origin_province ?? 'تهران',
            o?.city ?? old.origin_city ?? 'تهران',
            o?.region ?? old.origin_region,
            o?.area ?? old.origin_area ?? 'نامشخص',
            o?.point ?? old.origin_point ?? 'نامشخص',
            o?.mapX ?? old.origin_map_x,
            o?.mapY ?? old.origin_map_y,
            d?.province ?? old.destination_province ?? 'تهران',
            d?.city ?? old.destination_city ?? 'تهران',
            d?.region ?? old.destination_region,
            d?.area ?? old.destination_area ?? 'نامشخص',
            d?.point ?? old.destination_point ?? 'نامشخص',
            d?.mapX ?? old.destination_map_x,
            d?.mapY ?? old.destination_map_y,
            dw?.period ?? old.depart_period ?? 'morning',
            dw?.start ?? old.depart_start ?? '07:00',
            dw?.end ?? old.depart_end ?? '07:30',
            rw?.period ?? old.return_period ?? 'afternoon',
            rw?.start ?? old.return_start ?? '05:00',
            rw?.end ?? old.return_end ?? '05:30',
            data.daysGoing ?? old.days_going ?? [],
          ]
        );
      }

      // ─── ۳. car ───
      if (data.car) {
        await client.query(`UPDATE user_cars SET is_active = FALSE WHERE user_id = $1 AND is_active`, [userId]);
        const cls = carClassOf(data.car.model);
        const parity = plateParityFromBody(data.car.plateBody);
        await client.query(
          `INSERT INTO user_cars (user_id, car_model, car_class, plate_iran, plate_body, plate_parity, seats, is_active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE)`,
          [userId, data.car.model, cls, data.car.plateIran, data.car.plateBody, parity, data.car.seats]
        );
      }
    });

    res.json({ ok: true });
  })
);

// ─── POST /me/pause ──────────────────────────────────────

profileRouter.post(
  '/pause',
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      `UPDATE users SET grouping_paused = NOT grouping_paused, updated_at = now()
        WHERE id = $1 RETURNING grouping_paused`,
      [req.user.id]
    );
    res.json({ ok: true, groupingPaused: rows[0].grouping_paused });
  })
);
