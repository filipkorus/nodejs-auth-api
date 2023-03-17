import {emailExists, getUserById, isPassCorrect, usernameExists} from '../../services/user/auth.service';
import {deleteAccount, updateEmail, updatePass, updateUsername} from '../../services/user/settings.service';
import config from 'config';
import {
	ACCOUNT_DELETED,
	BAD_REQUEST,
	CUSTOM_RESPONSE,
	INPUT_EMAIL_EXIST,
	INPUT_USERNAME_EXIST,
	INVALID_PASSWORD, SERVER_ERROR
} from "../../helpers/responses/messages";
import {regexEmail} from "../../helpers/validation/regexes";

export const ChangeUsernameHandler = async (req, res) => {
	const {newUsername, password} = req.body;

	if (!(newUsername && password)) {
		return BAD_REQUEST(res);
	}

	if (newUsername.length < config.get<Object>("USERNAME_LENGTH").min || newUsername.length > config.get<Object>("USERNAME_LENGTH").max) {
		return CUSTOM_RESPONSE(
			res,
			`Username length must be between ${config.get<Object>("USERNAME_LENGTH").min} and ${config.get<Object>("USERNAME_LENGTH").max} characters`,
			400
		);
	}

	if (await usernameExists(newUsername)) {
		return INPUT_USERNAME_EXIST(res);
	}

	const user = await getUserById(res.locals.user.id)

	if (!(await isPassCorrect(password, user.password))) {
		return INVALID_PASSWORD(res);
	}

	if (await updateUsername(newUsername, res.locals.user.id)) {
		return CUSTOM_RESPONSE(res, 'Username has been updated', 200);
	}

	return SERVER_ERROR(res);
};

export const ChangeEmailHandler = async (req, res) => {
	const {newEmail, password} = req.body;

	if (!(newEmail && password)) {
		return BAD_REQUEST(res);
	}

	if (!regexEmail.test(newEmail)) {
		return CUSTOM_RESPONSE(res, 'Provide correct email address', 400);
	}

	if (await emailExists(newEmail)) {
		return INPUT_EMAIL_EXIST(res);
	}

	const user = await getUserById(res.locals.user.id)

	if (!(await isPassCorrect(password, user.password))) {
		return INVALID_PASSWORD(res);
	}

	/* TODO: implement email confirmation */

	if (await updateEmail(newEmail, res.locals.user.id)) {
		return CUSTOM_RESPONSE(res, 'Email has been updated', 200);
	}

	return SERVER_ERROR(res);
};

export const ChangePasswordHandler = async (req, res) => {
	const {newPassword, password} = req.body;

	if (!(newPassword && password)) {
		return BAD_REQUEST(res);
	}

	if (newPassword.length < config.get<Object>("PASSWORD_LENGTH").min || newPassword.length > config.get<Object>("PASSWORD_LENGTH").max) {
		return CUSTOM_RESPONSE(res, `Password length must be between ${config.get<Object>("PASSWORD_LENGTH").min} and ${config.get<Object>("PASSWORD_LENGTH").max} characters`, 400);
	}

	const user = await getUserById(res.locals.user.id)

	if (!(await isPassCorrect(password, user.password))) {
		return INVALID_PASSWORD(res);
	}

	if (await updatePass(newPassword, res.locals.user.id)) {
		return CUSTOM_RESPONSE(res, 'Password has been updated', 200);
	}

	return SERVER_ERROR(res);
};

export const DeleteAccountHandler = async (req, res) => {
	const {password} = req.body;

	if (!password) {
		return BAD_REQUEST(res);
	}

	const user = await getUserById(res.locals.user.id);

	if (!(await isPassCorrect(password, user.password))) {
		return INVALID_PASSWORD(res);
	}

	if (await deleteAccount(res.locals.user.id)) {
		return ACCOUNT_DELETED(res);
	}

	return SERVER_ERROR(res);
};
