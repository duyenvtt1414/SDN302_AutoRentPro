import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { CarModel } from '../models/Car.js';
import { BookingModel, BOOKING_STATUS } from '../models/Booking.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('MONGODB_URL =', process.env.MONGODB_URL);

// Load JSON files
const accountsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'accounts.json'), 'utf8'));
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cars.json'), 'utf8'));

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected DB');

  // Clear old data
  await UserModel.deleteMany();
  await CarModel.deleteMany();
  await BookingModel.deleteMany();

  /* =========================
     USERS
  ========================= */
  const users = [];
  for (const account of accountsData) {
    const hashedPassword = account.password ? await bcrypt.hash(account.password, 10) : undefined;
    const user = await UserModel.create({
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      password: hashedPassword,
      role: account.role,
    });
    users.push(user);
  }
  console.log(`✅ ${users.length} Users created`);

  /* =========================
     CARS
  ========================= */
  const cars = [];
  for (const carData of carsData) {
    const car = await CarModel.create(carData);
    cars.push(car);
  }
  console.log(`✅ ${cars.length} Cars created`);

  /* =========================
     BOOKINGS
  ========================= */
  const alice = users.find(u => u.email === 'alice@gmail.com');
  const honda = cars.find(c => c.brand === 'Honda');
  const toyota = cars.find(c => c.brand === 'Toyota');

  if (alice && honda) {
    await BookingModel.create({
      userId: alice._id,
      carId: honda._id,
      startDate: new Date('2026-01-09'),
      endDate: new Date('2026-01-11'),
      status: BOOKING_STATUS.CONFIRMED,
      totalPrice: 1650000,
    });
  }

  if (alice && toyota) {
    await BookingModel.create({
      userId: alice._id,
      carId: toyota._id,
      startDate: new Date('2026-01-22'),
      endDate: new Date('2026-01-25'),
      status: BOOKING_STATUS.CONFIRMED,
      totalPrice: 1800000,
    });
  }

  console.log('✅ Bookings created');

  console.log('🎉 SEED DATA DONE');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
