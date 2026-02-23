import mongoose from 'mongoose';
import { BookingModel } from '../models/Booking.js';

export async function createBooking({ userId, carId, startDate, endDate, status }) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid userId');
  }
  if (!mongoose.Types.ObjectId.isValid(carId)) {
    throw new Error('Invalid carId');
  }

  return BookingModel.create({
    userId,
    carId,
    startDate,
    endDate,
    status,
  });
}
