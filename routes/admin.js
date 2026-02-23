import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { CarModel } from '../models/Car.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Load JSON files
const loadAccountsData = () => {
  const filePath = path.join(__dirname, '../scripts/accounts.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const loadCarsData = () => {
  const filePath = path.join(__dirname, '../scripts/cars.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

/**
 * POST /api/admin/seed
 * Seed all data (users + cars) from JSON files
 */
router.post('/seed', async (req, res) => {
  try {
    const secretKey = req.body.secret;
    if (secretKey !== process.env.ADMIN_SECRET || !secretKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Clear old data
    await UserModel.deleteMany();
    await CarModel.deleteMany();

    // Seed users
    const accountsData = loadAccountsData();
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

    // Seed cars
    const carsData = loadCarsData();
    const cars = [];
    for (const carData of carsData) {
      const car = await CarModel.create(carData);
      cars.push(car);
    }

    res.json({
      success: true,
      message: 'Data seeded successfully',
      users: users.length,
      cars: cars.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/seed-users
 * Seed only users from accounts.json
 */
router.post('/seed-users', async (req, res) => {
  try {
    const secretKey = req.body.secret;
    if (secretKey !== process.env.ADMIN_SECRET || !secretKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await UserModel.deleteMany();

    const accountsData = loadAccountsData();
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

    res.json({
      success: true,
      message: 'Users seeded successfully',
      count: users.length,
      users: users.map(u => ({ email: u.email, fullName: u.fullName, role: u.role })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/seed-cars
 * Seed only cars from cars.json
 */
router.post('/seed-cars', async (req, res) => {
  try {
    const secretKey = req.body.secret;
    if (secretKey !== process.env.ADMIN_SECRET || !secretKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await CarModel.deleteMany();

    const carsData = loadCarsData();
    const cars = [];
    for (const carData of carsData) {
      const car = await CarModel.create(carData);
      cars.push(car);
    }

    res.json({
      success: true,
      message: 'Cars seeded successfully',
      count: cars.length,
      cars: cars.map(c => ({ name: c.name, brand: c.brand, status: c.status })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
