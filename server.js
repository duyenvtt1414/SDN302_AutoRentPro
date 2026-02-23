import dotenv from 'dotenv';
import app from './app.js';
import { connectMongoose } from './config/mongoose.js';

import './models/User.js';
import './models/Car.js';
import './models/Booking.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

connectMongoose()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
