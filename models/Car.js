import mongoose from 'mongoose';

export const CAR_STATUS = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  MAINTENANCE: 'MAINTENANCE',
};

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(CAR_STATUS),
      default: CAR_STATUS.AVAILABLE,
    },
  },
  { timestamps: true }
);

export const CarModel = mongoose.model('Car', carSchema);
