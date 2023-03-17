import respond from './respond';
import {Response} from 'express';

export const CUSTOM_RESPONSE = (res: Response, message: string, status: number, data: object = {}) => respond(res, message, status, data);

export const SUCCESS = (res: Response, data: object = {}) => respond(res, "Success", 200, data);

export const ACCOUNT_ACTIVATED = (res: Response, data: object = {}) => respond(res, "Your account has been activated", 200, data);

export const ACCOUNT_CREATED = (res: Response, data: object = {}) => respond(res, "Account has been created! Check your email to confirm", 201, data);

export const INPUT_USERNAME_EXIST = (res: Response, data: object = {}) => respond(res, "Given username is already used", 400, data);

export const INPUT_EMAIL_EXIST = (res: Response, data: object = {}) => respond(res, "Given email is already used", 400, data);

export const ACCOUNT_NOT_ACTIVATED = (res: Response, data: object = {}) => respond(res, "Activate your account before logging in", 403, data);

export const ACCOUNT_BANNED = (res: Response, data: object = {}) => respond(res, "Your account has been banned", 403, data);

export const ACCOUNT_DELETED = (res: Response, data: object = {}) => respond(res, "Your account has been deleted", 403, data);

export const BAD_REQUEST = (res: Response, data: object = {}) => respond(res,"Bad request", 400, data);

export const UNAUTHORIZED = (res: Response, data: object = {}) => respond(res, "Unauthorized", 401, data);

export const FORBIDDEN = (res: Response, data: object = {}) => respond(res, "Forbidden", 403, data);

export const NOT_FOUND = (res: Response, data: object = {}) => respond(res, "Not found", 404, data);

export const SERVER_ERROR = (res: Response, data: object = {}) => respond(res,"Server error", 500, data);

export const INVALID_PASSWORD = (res: Response, data: object = {}) => respond(res, "Invalid password", 403, data);

export const INVALID_LOGIN_CREDENTIALS = (res: Response, data: object = {}) => respond(res,"Invalid username or password", 403, data);
