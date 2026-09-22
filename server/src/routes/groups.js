// server/src/routes/groups.js
import { Router } from 'express';
import { query, withTransaction } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, badRequest, conflict, forbidden, notFound } from '../middleware/errors.js';
import { bestGroupFor, loadSelfAsMember } from '../services/matching.service.js';
import { logger } from '../config/logger.js';

export const groupsRouter = Router();
groupsRouter.use(requireAuth);

groupsRouter.post(
  '/smart',
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const me = await loadSelfAsMember(userId);
    if (!me) throw badRequest('PROFILE_INCOMPLETE', 'ابتدا پروفایل و مسیر خود را کامل کنید.');

    const { rows: existing } = await query(
      `SELECT g.id, g.status
         FROM groups g
         JOIN group_members gm ON gm.group_id = g.id
        WHERE gm.user_id = $1
          AND gm.left_at IS NULL
          AND g.status IN ('pending', 'active', 'incomplete')
        LIMIT 1`,
      [userId]
    );
    if (existing[0]) throw conflict('ALREADY_IN_GROUP', 'شما در حال حاضر در یک گروه فعال هستید.');

    const { rows: rejections } = await query(
      `SELECT DISTINCT target_user_id FROM proposal_rejections WHERE user_id = $1`,
      [userId]
    );
    const rejectedIds = rejections.map(r => String(r.target_user_id));

    const result = await bestGroupFor(userId, rejectedIds);

    if (result.picks.length === 0) {
      return res.json({
        ok: false,
        reason: 'NO_CANDIDATES',
        message: 'در حال حاضر گروه سازگاری یافت نشد. لطفاً بعداً تلاش کنید.',
      });
    }

    const created = await withTransaction(async (client) => {
      const groupSize = 1 + result.picks.length;

      const { rows: gRows } = await client.query(
        `INSERT INTO groups (group_mode, status, creator_id, target_size, origin_city, is_traffic_city)
         VALUES ('smart', 'pending', $1, $2, $3, $4) RETURNING id`,
        [userId, groupSize, me.originCity, ['تهران'].includes(me.originCity)]
      );
      const groupId = gRows[0].id;

      await client.query(
        `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'creator')`,
        [groupId, userId]
      );

      for (const p of result.picks) {
        await client.query(
          `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'member')`,
          [groupId, Number(p.id)]
        );
      }

      const deadlineAt = new Date(Date.now() + 24 * 3600 * 1000);
      const { rows: pRows } = await client.query(
        `INSERT INTO proposals (group_id, initiator_id, deadline_at, status)
         VALUES ($1, $2, $3, 'open') RETURNING id`,
        [groupId, userId, deadlineAt]
      );
      const proposalId = pRows[0].id;

      await client.query(
        `INSERT INTO proposal_members (proposal_id, user_id, response, responded_at, is_initiator)
         VALUES ($1, $2, 'accepted', now(), TRUE)`,
        [proposalId, userId]
      );

      for (const p of result.picks) {
        await client.query(
          `INSERT INTO proposal_members (proposal_id, user_id, response, is_initiator)
           VALUES ($1, $2, 'pending', FALSE)`,
          [proposalId, Number(p.id)]
        );
      }

      return { groupId, proposalId, size: groupSize };
    });

    logger.info({ userId, groupId: created.groupId, size: created.size }, 'smart group created');

    res.status(201).json({
      ok: true,
      groupId: created.groupId,
      proposalId: created.proposalId,
      size: created.size,
    });
  })
);

groupsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const groupId = Number(req.params.id);
    if (!Number.isFinite(groupId)) throw badRequest('BAD_ID', 'شناسه نامعتبر.');

    const { rows: membership } = await query(
      `SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2 AND left_at IS NULL`,
      [groupId, userId]
    );
    if (!membership[0]) throw forbidden('NOT_MEMBER', 'شما عضو این گروه نیستید.');

    const { rows: gRows } = await query(
      `SELECT id, group_mode, status, creator_id, target_size, origin_city, is_traffic_city,
              created_at, activated_at
         FROM groups WHERE id = $1`,
      [groupId]
    );
    const group = gRows[0];
    if (!group) throw notFound('GROUP_NOT_FOUND', 'گروه یافت نشد.');

    const { rows: members } = await query(
      `SELECT gm.user_id, gm.role,
              u.name, u.gender, u.age, u.photo_url, u.phone,
              c.car_model, c.plate_body, c.plate_parity
         FROM group_members gm
         JOIN users u ON u.id = gm.user_id
         LEFT JOIN user_cars c ON c.user_id = u.id AND c.is_active
        WHERE gm.group_id = $1 AND gm.left_at IS NULL
        ORDER BY gm.joined_at`,
      [groupId]
    );

    const { rows: proposalRows } = await query(
      `SELECT id, status, started_at, deadline_at, result
         FROM proposals WHERE group_id = $1 ORDER BY id DESC LIMIT 1`,
      [groupId]
    );
    const proposal = proposalRows[0];

    let proposalMembers = [];
    if (proposal) {
      const { rows } = await query(
        `SELECT pm.user_id, pm.response, pm.is_initiator,
                u.name, u.gender, u.age, u.photo_url, u.phone,
                c.car_model, c.plate_body, c.plate_parity
           FROM proposal_members pm
           JOIN users u ON u.id = pm.user_id
           LEFT JOIN user_cars c ON c.user_id = u.id AND c.is_active
          WHERE pm.proposal_id = $1`,
        [proposal.id]
      );
      proposalMembers = rows;
    }

    const iAccepted = proposalMembers.find(pm => pm.user_id === userId)?.response === 'accepted';

    const safeMembers = members.map(m => {
      const pm = proposalMembers.find(p => p.user_id === m.user_id);
      const reveal = m.user_id === userId || (pm?.response === 'accepted' && iAccepted);
      return {
        userId: m.user_id,
        role: m.role,
        isMe: m.user_id === userId,
        response: pm?.response || null,
        name: reveal ? m.name : null,
        photoUrl: reveal ? m.photo_url : null,
        phone: reveal ? m.phone : null,
        gender: m.gender,
        age: reveal ? m.age : null,
        car: reveal ? m.car_model : null,
        plateBody: reveal ? m.plate_body : null,
        plateParity: m.plate_parity,
      };
    });

    res.json({
      group: {
        id: group.id,
        mode: group.group_mode,
        status: group.status,
        targetSize: group.target_size,
        originCity: group.origin_city,
        isCreator: group.creator_id === userId,
      },
      members: safeMembers,
      proposal: proposal ? {
        id: proposal.id,
        status: proposal.status,
        deadlineAt: proposal.deadline_at,
      } : null,
      myResponse: proposalMembers.find(pm => pm.user_id === userId)?.response || null,
    });
  })
);

groupsRouter.post(
  '/:id/accept',
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const groupId = Number(req.params.id);

    await withTransaction(async (client) => {
      const { rows: pRows } = await client.query(
        `SELECT id FROM proposals WHERE group_id = $1 AND status = 'open' ORDER BY id DESC LIMIT 1`,
        [groupId]
      );
      const proposal = pRows[0];
      if (!proposal) throw badRequest('NO_OPEN_PROPOSAL', 'پیشنهاد باز وجود ندارد.');

      const { rowCount } = await client.query(
        `UPDATE proposal_members SET response = 'accepted', responded_at = now()
          WHERE proposal_id = $1 AND user_id = $2 AND response = 'pending'`,
        [proposal.id, userId]
      );
      if (rowCount === 0) throw conflict('ALREADY_RESPONDED', 'قبلاً پاسخ داده‌اید.');

      const { rows: counts } = await client.query(
        `SELECT
           COUNT(*) FILTER (WHERE response = 'accepted') AS accepted,
           COUNT(*) FILTER (WHERE response = 'pending')  AS pending
         FROM proposal_members WHERE proposal_id = $1`,
        [proposal.id]
      );

      if (Number(counts[0].pending) === 0 && Number(counts[0].accepted) >= 2) {
        await client.query(
          `UPDATE proposals SET status = 'accepted', finalized_at = now(), result = 'full_group'
            WHERE id = $1`,
          [proposal.id]
        );
        await client.query(
          `UPDATE groups SET status = 'active', activated_at = now() WHERE id = $1`,
          [groupId]
        );
      }
    });

    res.json({ ok: true });
  })
);

groupsRouter.post(
  '/:id/reject',
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const groupId = Number(req.params.id);

    await withTransaction(async (client) => {
      const { rows: pRows } = await client.query(
        `SELECT id FROM proposals WHERE group_id = $1 AND status = 'open' ORDER BY id DESC LIMIT 1`,
        [groupId]
      );
      const proposal = pRows[0];
      if (!proposal) throw badRequest('NO_OPEN_PROPOSAL', 'پیشنهاد باز وجود ندارد.');

      const { rowCount } = await client.query(
        `UPDATE proposal_members SET response = 'declined', responded_at = now()
          WHERE proposal_id = $1 AND user_id = $2 AND response = 'pending'`,
        [proposal.id, userId]
      );
      if (rowCount === 0) throw conflict('ALREADY_RESPONDED', 'قبلاً پاسخ داده‌اید.');

      const { rows: others } = await client.query(
        `SELECT user_id FROM proposal_members
          WHERE proposal_id = $1 AND user_id <> $2 AND is_initiator = FALSE`,
        [proposal.id, userId]
      );
      for (const o of others) {
        await client.query(
          `INSERT INTO proposal_rejections (user_id, target_user_id, proposal_id)
           VALUES ($1, $2, $3) ON CONFLICT (user_id, target_user_id) DO NOTHING`,
          [userId, o.user_id, proposal.id]
        );
      }
    });

    res.json({ ok: true });
  })
);

groupsRouter.post(
  '/:id/leave',
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const groupId = Number(req.params.id);

    await withTransaction(async (client) => {
      await client.query(
        `UPDATE group_members SET left_at = now(), removal_reason = 'left'
          WHERE group_id = $1 AND user_id = $2 AND left_at IS NULL`,
        [groupId, userId]
      );

      const { rows } = await client.query(
        `SELECT COUNT(*) AS n FROM group_members WHERE group_id = $1 AND left_at IS NULL`,
        [groupId]
      );
      if (Number(rows[0].n) < 2) {
        await client.query(`UPDATE groups SET status = 'closed', closed_at = now() WHERE id = $1`, [groupId]);
      } else {
        await client.query(`UPDATE groups SET status = 'incomplete' WHERE id = $1`, [groupId]);
      }
    });

    res.json({ ok: true });
  })
);
