import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './_utils';
import { db } from '../src/db';
import { bookings } from '../src/db/schema';
import { and, eq, gte, lte, asc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { start, end, status } = req.query;
    let conditions: any[] = [];

    if (start) conditions.push(gte(bookings.bookingDate, start as string));
    if (end) conditions.push(lte(bookings.bookingDate, end as string));
    if (status) conditions.push(eq(bookings.status, status as string));

    const query = db.select()
      .from(bookings)
      .orderBy(asc(bookings.bookingDate), asc(bookings.bookingTime));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const results = await query;
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
