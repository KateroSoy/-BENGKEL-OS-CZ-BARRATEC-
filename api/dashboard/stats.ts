import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { db } from '../../src/db';
import { bookings } from '../../src/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const todayBookings = await db.select({ count: sql<number>`count(*)` })
      .from(bookings).where(eq(bookings.bookingDate, today));

    const statusCounts = await db.select({
      status: bookings.status,
      count: sql<number>`count(*)`
    }).from(bookings).where(eq(bookings.bookingDate, today)).groupBy(bookings.status);

    res.json({
      todayTotal: todayBookings[0]?.count || 0,
      statuses: statusCounts
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
