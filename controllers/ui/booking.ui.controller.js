import mongoose from 'mongoose';
import { BookingModel, BOOKING_STATUS } from '../../models/Booking.js';
import { CarModel } from '../../models/Car.js';
import { UserModel } from '../../models/User.js';
import { createBooking } from '../../services/bookingService.js';
import { parseDate } from '../../utils/date.js';

export async function renderBookingList(req, res) {
  const bookings = await BookingModel.find()
    .populate('userId', 'fullName email')
    .populate('carId', 'name brand')
    .sort({ createdAt: -1 })
    .lean();

  res.render('bookings/list', {
    title: 'Booking Management',
    bookings,
  });
}

export async function renderBookingNew(req, res) {
  const cars = await CarModel.find().lean();
  const users = await UserModel.find().lean();

  res.render('bookings/new', {
    title: 'Create booking',
    cars,
    users,
    statuses: Object.values(BOOKING_STATUS),
  });
}

export async function createBookingFromUI(req, res) {
  try {
    const { userId, carId, startDate, endDate, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('User không hợp lệ');
    }
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new Error('Car không hợp lệ');
    }

    const s = parseDate(startDate);
    const e = parseDate(endDate);

    await createBooking({
      userId: new mongoose.Types.ObjectId(userId),
      carId: new mongoose.Types.ObjectId(carId),
      startDate: s,
      endDate: e,
      status,
    });

    return res.redirect('/ui/bookings');
  } catch (err) {
    const cars = await CarModel.find().lean();
    const users = await UserModel.find().lean();

    return res.status(400).render('bookings/new', {
      title: 'Create booking',
      cars,
      users,
      statuses: Object.values(BOOKING_STATUS),
      error: err.message,
      form: req.body,
    });
  }
}
