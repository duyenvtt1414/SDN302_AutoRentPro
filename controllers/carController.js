import { listCars } from '../services/carService.js';

export async function getCars(req, res) {
  try {
    const { status } = req.query;
    const cars = await listCars({ status });
    return res.json(cars);
  } catch (err) {
    return res.status(500).json({
      error: { message: err.message, code: 'SERVER_ERROR' },
    });
  }
}

