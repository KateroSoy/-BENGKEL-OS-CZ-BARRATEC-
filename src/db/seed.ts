import { db } from './index';
import { users, services, technicians, workshopSettings } from './schema';
import crypto from 'crypto';

async function seed() {
  console.log('Seeding data...');

  // Admin user
  const adminExists = await db.select().from(users).limit(1);
  if (adminExists.length === 0) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      name: 'Admin',
      email: 'admin@bengkel.com',
      passwordHash: 'admin123', // In real app, hash this with bcrypt
      role: 'owner',
    });
    console.log('Admin user seeded');
  }

  // Workshop settings
  const settingsExist = await db.select().from(workshopSettings).limit(1);
  if (settingsExist.length === 0) {
    await db.insert(workshopSettings).values({
      id: crypto.randomUUID(),
      workshopName: 'BENGKEL OS CZ BARRATEC',
      phone: '6281234567890',
      address: 'Jl. Otomotif No. 1, Jakarta',
      openTime: '08:00',
      closeTime: '17:00',
      maxBookingPerSlot: 3,
      slotIntervalMinutes: 60,
      operationalDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    });
    console.log('Settings seeded');
  }

  // Services
  const servicesList = [
    { name: 'Servis ringan' },
    { name: 'Servis berat' },
    { name: 'Ganti oli' },
    { name: 'Tune up' },
    { name: 'AC mobil' },
    { name: 'Rem' },
    { name: 'Kaki-kaki' },
    { name: 'Mesin' },
    { name: 'Kelistrikan' },
    { name: 'Lainnya' },
  ];
  
  const existingServices = await db.select().from(services).limit(1);
  if (existingServices.length === 0) {
    for (const service of servicesList) {
      await db.insert(services).values({
        id: crypto.randomUUID(),
        name: service.name,
      });
    }
    console.log('Services seeded');
  }

  // Technicians
  const techniciansList = [
    { name: 'Teknisi Umum', specialty: 'General' },
    { name: 'Spesialis Mesin', specialty: 'Engine' },
    { name: 'Spesialis AC', specialty: 'AC' },
    { name: 'Spesialis Kaki-kaki', specialty: 'Suspension' },
  ];

  const existingTechs = await db.select().from(technicians).limit(1);
  if (existingTechs.length === 0) {
    for (const tech of techniciansList) {
      await db.insert(technicians).values({
        id: crypto.randomUUID(),
        name: tech.name,
        specialty: tech.specialty,
      });
    }
    console.log('Technicians seeded');
  }

  console.log('Seed completed!');
}

seed().catch(console.error);
