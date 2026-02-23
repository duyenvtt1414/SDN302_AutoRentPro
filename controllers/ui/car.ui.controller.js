import { CarModel, CAR_STATUS } from '../../models/Car.js';

export async function renderCarList(req, res) {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const cars = await CarModel.find(filter).lean();
  res.render('cars/list', {
    title: 'Car Management',
    cars,
    status,
    statuses: Object.values(CAR_STATUS),
  });
}

export function renderCarNew(req, res) {
  res.render('cars/new', {
    title: 'Add new car',
    statuses: Object.values(CAR_STATUS),
  });
}

export async function createCar(req, res) {
  try {
    const { name, brand, pricePerDay, status } = req.body;
    await CarModel.create({ name, brand, pricePerDay, status });
    return res.redirect('/ui/cars');
  } catch (err) {
    return res.status(400).render('cars/new', {
      title: 'Add new car',
      statuses: Object.values(CAR_STATUS),
      error: err.message,
      form: req.body,
    });
  }
}

export async function renderCarEdit(req, res) {
  const car = await CarModel.findById(req.params.id).lean();
  if (!car) return res.status(404).render('errors/404', { title: 'Car not found' });

  res.render('cars/edit', {
    title: 'Edit car',
    car,
    statuses: Object.values(CAR_STATUS),
  });
}

export async function updateCar(req, res) {
  try {
    const { name, brand, pricePerDay, status } = req.body;
    await CarModel.findByIdAndUpdate(req.params.id, { name, brand, pricePerDay, status }, { runValidators: true });
    return res.redirect('/ui/cars');
  } catch (err) {
    const car = await CarModel.findById(req.params.id).lean();
    return res.status(400).render('cars/edit', {
      title: 'Edit car',
      car,
      statuses: Object.values(CAR_STATUS),
      error: err.message,
    });
  }
}

export async function deleteCar(req, res) {
  await CarModel.findByIdAndDelete(req.params.id);
  res.redirect('/ui/cars');
}
