import { Router } from 'express';
import requireAuth from '../../middleware/requireAuth';
import {GetUserHandler} from '../../controllers/user/auth.controller';

import authRouter from './auth/auth.router';
import settingsRouter from './settings/settings.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/settings', requireAuth, settingsRouter);

router.get('/', requireAuth, GetUserHandler);

export default router;
