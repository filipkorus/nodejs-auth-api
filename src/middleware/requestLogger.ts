import config from 'config';
import {NextFunction, Response, Request} from 'express';
import {logInfo} from '../utils/logger';

/**
 * HTTP request logger - express middleware.
 */
function requestLogger (req: Request, res: Response, next: NextFunction) {
	if (!config.get<boolean>("USE_REQUEST_LOGGER")) {
		return next();
	}

	logInfo(req.method + ' ' + req.originalUrl);
	next();
};

export default requestLogger;
