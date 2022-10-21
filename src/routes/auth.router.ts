import express from 'express';
import {ActivateAccount, GetUser, Login, Logout, Refresh, Register} from '../controllers/auth.controller';
import {Auth, Role} from '../middlewares/auth.middleware';

const router = express.Router()
	.post('/register', Register)
	.get('/activate-account/:token', ActivateAccount)
	.post('/login', Login)
	.post('/refresh', Refresh)

	.get('/logout', Auth, Logout)
	.get('/user', Auth, GetUser);

export default router;
