import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './_utils';
import { db } from '../src/db';
import { bookings, workshopSettings } from '../src/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const date = req.query.date as string;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const settings = await db.select().from(workshopSettings).limit(1);
    if (!settings.length) return res.status(400).json({ error: "Settings not found" });

    // Find bookings on this date
    const existingBookings = await db.select({
      time: bookings.bookingTime,
      count: sql<number>`count(*)`
    })
    .from(bookings)
    .where(and(eq(bookings.bookingDate, date), sql`status NOT IN ('Batal', 'Tidak Datang')`))
    .groupBy(bookings.bookingTime);

    res.json({
      settings: settings[0],
      bookings: existingBookings
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
