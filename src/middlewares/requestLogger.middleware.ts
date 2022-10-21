import COLOUR from '../utils/colours';
import CONFIG from '../config';

/**
 * HTTP request logger - express middleware.
 */
export const requestLogger = (req, res, next) => {
	if (!CONFIG.useRequestLogger) {
		next();
	}

	let bgColour = null;
	switch (req.method) {
		case 'GET':
			bgColour = COLOUR.bgCyan;
			break;
		case 'POST':
			bgColour = COLOUR.bgGreen;
			break;
		case 'DELETE':
			bgColour = COLOUR.bgRed;
			break;
		case 'PUT':
			bgColour = COLOUR.bgYellow;
			break;
		default:
			bgColour = COLOUR.bgBlack;
	}
	console.log(bgColour, req.method, COLOUR.reset, req.originalUrl);
	next();
};
