import {Router} from 'express';
import {ActivateAccountHandler, LoginHandler, LogoutHandler, RefreshTokenHandler, RegisterHandler} from '../../../controllers/user/auth.controller';
import requireAuth from '../../../middleware/requireAuth';

const router = Router();

router.post('/register', RegisterHandler);
router.get('/activate-account/:token', ActivateAccountHandler);
router.post('/login', LoginHandler);
router.post('/refresh', RefreshTokenHandler);

router.get('/logout', requireAuth, LogoutHandler);

export default router;
