import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../../_utils';
import { db } from '../../../src/db';
import { bookings } from '../../../src/db/schema';
import { eq } from 'drizzle-orm';

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

    const { technicianId } = req.body;
    await db.update(bookings).set({ technicianId }).where(eq(bookings.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
