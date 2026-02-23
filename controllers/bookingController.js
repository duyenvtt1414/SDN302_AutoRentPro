import mongoose from "mongoose";
import { createBooking } from "../services/bookingService.js";
import { parseDate } from "../utils/date.js";
import { BookingModel } from "../models/Booking.js";
import { calcTotalPrice } from "../utils/price.js";

function isObjectId(v) {
  return mongoose.Types.ObjectId.isValid(v);
}

export async function postBooking(req, res) {
  try {
    const { userId, carId, startDate, endDate, status } = req.body;

    if (!userId || !carId) {
      return res.status(400).json({
        error: { message: "Missing userId or carId", code: "VALIDATION_ERROR" },
      });
    }
    if (!isObjectId(userId) || !isObjectId(carId)) {
      return res.status(400).json({
        error: {
          message: "userId/carId must be valid ObjectId",
          code: "VALIDATION_ERROR",
        },
      });
    }

    const s = parseDate(startDate);
    const e = parseDate(endDate);
    if (!s || !e) {
      return res.status(400).json({
        error: {
          message: "Invalid startDate or endDate",
          code: "VALIDATION_ERROR",
        },
      });
    }

    const { booking, contract } = await createBooking({
      userId,
      carId,
      startDate: s,
      endDate: e,
      status,
    });

    return res.status(201).json({
      message: "Booking created",
      bookingId: booking._id,
      totalPrice: booking.totalPrice,
      contractCreated: !!contract,
      contractId: contract?._id || null,
    });
  } catch (err) {
    if (err?.name === "ValidationError") {
      return res.status(400).json({
        error: { message: err.message, code: "VALIDATION_ERROR" },
      });
    }

    const statusCode = err.status || 500;
    return res.status(statusCode).json({
      error: { message: err.message, code: err.code || "SERVER_ERROR" },
    });
  }
}

export const getAllBookings = async (req, res, next) => { 
  try {
    const bookings = await BookingModel.find().populate('carId').populate('userId');
    res.status(200).json(bookings);
  } catch (e) {
    next(e);
  }
};
