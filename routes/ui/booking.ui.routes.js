import express from 'express';
import {
  renderBookingList,
  renderBookingNew,
  createBookingFromUI,
} from '../../controllers/ui/booking.ui.controller.js';

const router = express.Router();

router.get('/', renderBookingList);
router.get('/new', renderBookingNew);
router.post('/new', createBookingFromUI);

export default router;
