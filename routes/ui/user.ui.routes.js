import { Router } from 'express';
import { renderUserList, renderUserNew, createUser } from '../../controllers/ui/user.ui.controller.js';

const router = Router();

router.get('/', renderUserList);
router.get('/new', renderUserNew);
router.post('/', createUser);

export default router;
