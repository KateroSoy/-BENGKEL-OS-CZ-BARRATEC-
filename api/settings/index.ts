import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { db } from '../../src/db';
import { workshopSettings } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    try {
      const data = await db.select().from(workshopSettings).limit(1);
      res.json(data[0] || null);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  } else if (req.method === 'PUT') {
    try {
      const data = req.body;
      const existing = await db.select().from(workshopSettings).limit(1);
      if (existing.length > 0) {
        await db.update(workshopSettings).set(data).where(eq(workshopSettings.id, existing[0].id));
      } else {
        data.id = crypto.randomUUID();
        await db.insert(workshopSettings).values(data);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
