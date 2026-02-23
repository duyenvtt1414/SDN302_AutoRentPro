import mongoose from 'mongoose';

export const CONTRACT_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  CANCELED: 'CANCELED',
};

const contractSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(CONTRACT_STATUS),
      default: CONTRACT_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

export const ContractModel = mongoose.model('Contract', contractSchema);
