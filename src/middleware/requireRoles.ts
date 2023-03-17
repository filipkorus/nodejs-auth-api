import {NextFunction, Request, Response} from 'express';
import {FORBIDDEN} from "../helpers/responses/messages";

/**
 * Role-based authorization - express middleware.
 *
 * @returns {function} Express middleware function.
 * @param roles {...list} Roles to be authorized.
 */
function requireRoles(...roles: string[]) {
	return (_: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(res.locals.user.role)) {
			return FORBIDDEN(res);
		}
		next();
	};
}

export default requireRoles;
