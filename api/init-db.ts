import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './_utils';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'POSTGRES_URL not configured' });
  }

  const sql = neon(connectionString);

  try {
    // Create all tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        estimated_duration INTEGER,
        estimated_price INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS technicians (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        specialty TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS workshop_settings (
        id TEXT PRIMARY KEY,
        workshop_name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        open_time TEXT NOT NULL,
        close_time TEXT NOT NULL,
        max_booking_per_slot INTEGER DEFAULT 3,
        slot_interval_minutes INTEGER DEFAULT 60,
        operational_days TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        booking_code TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        booking_date TEXT NOT NULL,
        booking_time TEXT NOT NULL,
        car_type TEXT NOT NULL,
        car_year INTEGER,
        plate_number TEXT,
        problem_description TEXT NOT NULL,
        service_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Baru',
        source TEXT NOT NULL DEFAULT 'Online Form',
        customer_note TEXT,
        admin_note TEXT,
        estimated_price INTEGER,
        estimated_finish_time TEXT,
        technician_id TEXT REFERENCES technicians(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS booking_status_history (
        id TEXT PRIMARY KEY,
        booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        old_status TEXT,
        new_status TEXT NOT NULL,
        note TEXT,
        changed_by TEXT REFERENCES users(id),
        changed_at TIMESTAMP DEFAULT NOW()
      )
    `;

    res.json({ success: true, message: 'All tables created successfully' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
