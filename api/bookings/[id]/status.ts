import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../../_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });
  res.json({ success: true });
}
