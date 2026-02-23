import { Router } from 'express';
import { getContracts } from '../controllers/contractController.js';

const router = Router();

router.get('/contracts', getContracts);
export default router;
