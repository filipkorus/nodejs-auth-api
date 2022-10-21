import express from 'express';
import {ChangeEmail, ChangePassword, ChangeUsername, DeleteAccount} from '../controllers/userSettings.controller';

const router = express.Router()
	.put('/username', ChangeUsername)
	.put('/email', ChangeEmail)
	.put('/password', ChangePassword)
	.put('/delete-account', DeleteAccount)

export default router;
