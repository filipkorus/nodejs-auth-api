import {getUserById, verifyAccessToken} from '../services/user/auth.service';
import {UNAUTHORIZED} from "../helpers/responses/messages";

/**
 * User authentication - express middleware.
 */
async function requireAuth (req, res, next) {
	const accessToken = req.header('Authorization')?.split(' ')[1] || '';
	const payload: any = verifyAccessToken(accessToken);
	if (payload == null) {
		return UNAUTHORIZED(res);
	}

	const user = await getUserById(payload.id);
	if (user == null || user.banned) {
		return UNAUTHORIZED(res);
	}

	const {password, ...data} = user;
	res.locals.user = data;
	next();
};

export default requireAuth;
