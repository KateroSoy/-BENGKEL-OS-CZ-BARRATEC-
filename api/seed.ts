import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './_utils';
import { seedDatabase } from '../src/server/seed';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
