import { Router } from 'express';
import { renderLogin, handleLogin, handleLogout, renderSignUp, handleSignUp } from '../../controllers/ui/auth.ui.controller.js';

const router = Router();

router.get('/login', renderLogin);
router.post('/login', handleLogin);
router.get('/signup', renderSignUp);
router.post('/signup', handleSignUp);
router.post('/logout', handleLogout);

export default router;
