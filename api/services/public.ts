import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { db } from '../../src/db';
import { services } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await db.select().from(services).where(eq(services.isActive, true));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
