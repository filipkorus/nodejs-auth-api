import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/api.router';
import CONFIG from './config';
import {requestLogger} from './middlewares/requestLogger.middleware';

/* import environment variables */
dotenv.config({path:CONFIG.envFilePath});

/* MAIN SERVER */
const PORT = process.env.APP_PORT || 3000;

const app = express()
	.use(express.json())
	.use(cookieParser())
	.use(cors({
		origin: process.env.API_WHITELIST.split(';'),
		credentials: true
	}))

	.use(requestLogger)
	
	.use('/api', apiRouter)

	/* SERVE STATIC FILES (FRONTEND) */
	.use('/', express.static(CONFIG.staticFilesDir))
	.get('*', (req, res) => res.sendFile(path.resolve(CONFIG.staticFilesDir, 'index.html')))

	.listen(PORT, () => console.log(`App server is listening at http://localhost:${PORT}`));
