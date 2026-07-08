import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../../_utils';
import { db } from '../../../src/db';
import { bookings, technicians, bookingStatusHistory, users } from '../../../src/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const result = await db.select({
      booking: bookings,
      technician: technicians
    })
    .from(bookings)
    .leftJoin(technicians, eq(bookings.technicianId, technicians.id))
    .where(eq(bookings.id, id))
    .limit(1);

    if (!result.length) return res.status(404).json({ error: "Not found" });

    const history = await db.select({
      id: bookingStatusHistory.id,
      oldStatus: bookingStatusHistory.oldStatus,
      newStatus: bookingStatusHistory.newStatus,
      note: bookingStatusHistory.note,
      changedAt: bookingStatusHistory.changedAt,
      changedBy: bookingStatusHistory.changedBy,
      adminName: users.name
    })
      .from(bookingStatusHistory)
      .leftJoin(users, eq(bookingStatusHistory.changedBy, users.id))
      .where(eq(bookingStatusHistory.bookingId, id))
      .orderBy(desc(bookingStatusHistory.changedAt));

    res.json({
      ...result[0].booking,
      technicianName: result[0].technician?.name,
      history
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
