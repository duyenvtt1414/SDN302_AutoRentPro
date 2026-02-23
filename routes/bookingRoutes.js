import express from 'express';
import {
  renderBookingList,
  renderBookingNew,
  createBookingFromUI,
} from '../../controllers/ui/booking.ui.controller.js';

const router = express.Router();

// LIST
router.get('/', renderBookingList);

// CREATE FORM
router.get('/new', renderBookingNew);

// SUBMIT FORM
router.post('/new', createBookingFromUI);

export default router;
