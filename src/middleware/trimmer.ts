import { Request, Response, NextFunction } from 'express';
import {logError} from '../utils/logger';

function trimmer(req: Request, res: Response, next: NextFunction) {
	try {
		Object.keys(req.body).map(function (key, _index) {
			if (typeof req.body[key] === 'string') { req.body[key] = req.body[key].trim(); }
		});

		next();
	} catch (error) {
		logError(error);
	}
}

export default trimmer;
