import { Router } from 'express';
import {
  renderCarList,
  renderCarNew,
  createCar,
  renderCarEdit,
  updateCar,
  deleteCar,
} from '../../controllers/ui/car.ui.controller.js';

const router = Router();

router.get('/', renderCarList);
router.get('/new', renderCarNew);
router.post('/', createCar);

router.get('/:id/edit', renderCarEdit);
router.post('/:id', updateCar);          // đơn giản: POST update
router.post('/:id/delete', deleteCar);   // đơn giản: POST delete

export default router;
