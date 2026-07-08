import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { db } from '../../src/db';
import { workshopSettings } from '../../src/db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const settings = await db.select().from(workshopSettings).limit(1);
    if (!settings.length) return res.json(null);
    res.json(settings[0]);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
