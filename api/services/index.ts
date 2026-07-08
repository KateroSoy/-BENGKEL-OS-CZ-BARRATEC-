import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { db } from '../../src/db';
import { services } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    try {
      const data = await db.select().from(services);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, estimatedDuration, estimatedPrice } = req.body;
      const id = crypto.randomUUID();
      await db.insert(services).values({ id, name, estimatedDuration, estimatedPrice });
      res.json({ id });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
