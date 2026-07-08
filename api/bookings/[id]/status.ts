import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../../_utils';
import { db } from '../../../src/db';
import { bookings, bookingStatusHistory, users } from '../../../src/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const { status, note } = req.body;

    const old = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (!old.length) return res.status(404).json({ error: "Not found" });

    const admin = await db.select().from(users).limit(1);
    const adminId = admin.length > 0 ? admin[0].id : null;

    await db.update(bookings).set({ status }).where(eq(bookings.id, id));

    await db.insert(bookingStatusHistory).values({
      id: crypto.randomUUID(),
      bookingId: id,
      oldStatus: old[0].status,
      newStatus: status,
      note: note || "Status updated manually",
      changedBy: adminId
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
