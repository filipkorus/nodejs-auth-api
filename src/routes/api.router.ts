import express from 'express';
import {Auth} from '../middlewares/auth.middleware';
import authRouter from './auth.router';
import userSettings from './userSettings.router';

const router = express.Router()
	.use('/auth', authRouter)
	.use('/user-settings', Auth, userSettings)

	.get('/', (req, res) => res.json({
		success: true,
		msg: 'Auth API v1.0',
		nodeVersion: process.version
	}));

export default router;
