import {Router} from 'express';
import {ChangeEmailHandler, ChangePasswordHandler, ChangeUsernameHandler, DeleteAccountHandler} from '../../../controllers/user/settings.controller';

const router = Router();

router.put('/username', ChangeUsernameHandler);
router.put('/email', ChangeEmailHandler);
router.put('/password', ChangePasswordHandler);
router.put('/delete-account', DeleteAccountHandler);

export default router;
