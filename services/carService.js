import { CarModel } from '../models/Car.js';

export async function listCars({ status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  return CarModel.find(filter).lean();
}
