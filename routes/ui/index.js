import { Router } from 'express';
import carUiRoutes from './car.ui.routes.js';
import userUiRoutes from './user.ui.routes.js';
import bookingUiRoutes from './booking.ui.routes.js';
import authUiRoutes from './auth.ui.routes.js';
import { requireUiAuth } from '../../middlewares/uiAuth.js';

const router = Router();

// auth routes
router.use(authUiRoutes);

// redirect root to login or dashboard
router.get('/', (req, res) => {
  if (req.session?.user) {
    return res.render('home', { title: 'AutoRent Pro - Admin' });
  }
  res.redirect('/ui/login');
});

// protect ALL other /ui pages
router.use(requireUiAuth);

router.use('/cars', carUiRoutes);
router.use('/users', userUiRoutes);
router.use('/bookings', bookingUiRoutes);

export default router;
