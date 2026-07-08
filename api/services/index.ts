import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { getServices, getActiveServices } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    return res.json(getServices());
  }
  if (req.method === 'POST') {
    return res.json({ id: `svc-mock-${Date.now()}` });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
