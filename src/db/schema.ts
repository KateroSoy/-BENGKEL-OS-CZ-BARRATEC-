import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// services table
export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  estimatedDuration: integer('estimated_duration'), // minutes
  estimatedPrice: integer('estimated_price'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// technicians table
export const technicians = sqliteTable('technicians', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  specialty: text('specialty'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// workshop_settings table
export const workshopSettings = sqliteTable('workshop_settings', {
  id: text('id').primaryKey(),
  workshopName: text('workshop_name').notNull(),
  phone: text('phone'),
  address: text('address'),
  openTime: text('open_time').notNull(), // 'HH:MM'
  closeTime: text('close_time').notNull(), // 'HH:MM'
  maxBookingPerSlot: integer('max_booking_per_slot').default(3),
  slotIntervalMinutes: integer('slot_interval_minutes').default(60),
  operationalDays: text('operational_days', { mode: 'json' }), // array of 0-6 days
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// bookings table
export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  bookingCode: text('booking_code').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  bookingDate: text('booking_date').notNull(), // 'YYYY-MM-DD'
  bookingTime: text('booking_time').notNull(), // 'HH:MM'
  carType: text('car_type').notNull(),
  carYear: integer('car_year'),
  plateNumber: text('plate_number'),
  problemDescription: text('problem_description').notNull(),
  serviceType: text('service_type').notNull(),
  status: text('status').notNull().default('Baru'),
  source: text('source').notNull().default('Online Form'),
  customerNote: text('customer_note'),
  adminNote: text('admin_note'),
  estimatedPrice: integer('estimated_price'),
  estimatedFinishTime: text('estimated_finish_time'), // ISO string
  technicianId: text('technician_id').references(() => technicians.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// booking_status_history table
export const bookingStatusHistory = sqliteTable('booking_status_history', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  oldStatus: text('old_status'),
  newStatus: text('new_status').notNull(),
  note: text('note'),
  changedBy: text('changed_by').references(() => users.id),
  changedAt: integer('changed_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Note on PostgreSQL vs SQLite:
// The user requested PostgreSQL but explicitly disabled Cloud SQL. 
// For a fully working persistence environment out-of-the-box on AI Studio, 
// we use SQLite. The Drizzle ORM syntax here is largely identical and maps easily.
