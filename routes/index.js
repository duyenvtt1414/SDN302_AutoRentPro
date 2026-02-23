import express from 'express';
import bookingUIRoutes from  './ui/booking.ui.routes.js';
import carUIRoutes from './ui/car.ui.routes.js';
import userUIRoutes from './ui/user.ui.routes.js';
import authUIRoutes from './ui/auth.ui.routes.js';

const router = express.Router();

router.use('/login', authUIRoutes);
router.use('/bookings', bookingUIRoutes);
router.use('/cars', carUIRoutes);
router.use('/users', userUIRoutes);

router.get('/', (req, res) => {
  res.redirect('/ui/login');
});

export default router;
