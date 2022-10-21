import {getUserById, verifyAccessToken} from '../services/auth.service';

/**
 * User authentication - express middleware.
 */
export const Auth = async (req, res, next) => {
	const accessToken = req.header('Authorization')?.split(' ')[1] || '';
	const payload: any = verifyAccessToken(accessToken);
	if (payload == null) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized'
		});
	}

	const user = await getUserById(payload.id);
	if (user == null || user.banned) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized'
		});
	}

	const {password, ...data} = user;
	(req as any).user = data;
	next();
};

/**
 * Role-based authorization - express middleware.
 *
 * @returns {function} Express middleware function.
 * @param roles {...list} Roles to be authorized.
 */
export const Role = (...roles: string[]) => (req, res, next) => {
	if (!roles.includes((req as any).user.role)) {
		return res.status(403).json({
			success: false,
			message: 'Forbidden'
		});
	}
	next();
};
