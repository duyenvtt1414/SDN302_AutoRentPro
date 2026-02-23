import { Router } from 'express';
import { getCars } from '../controllers/carController.js';

const router = Router();

router.get('/cars', getCars);

export default router;
