import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { getSettings } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.json(getSettings());
}
