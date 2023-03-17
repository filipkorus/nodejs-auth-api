import {
	usernameExists,
	emailExists,
	createUser,
	getActivationTokenRecord,
	activateAccount,
	getUserByUsernameOrEmail,
	isPassCorrect,
	generateRefreshToken,
	generateAccessToken,
	deleteRefreshToken,
	verifyRefreshToken,
	getRefreshToken,
	deleteExpiredRefreshTokens
} from '../../services/user/auth.service';
import config from 'config';
import COOKIE_TYPE from '../../helpers/cookies/type';
import {
	ACCOUNT_ACTIVATED, ACCOUNT_BANNED,
	ACCOUNT_CREATED, ACCOUNT_NOT_ACTIVATED,
	BAD_REQUEST,
	CUSTOM_RESPONSE,
	INPUT_EMAIL_EXIST,
	INPUT_USERNAME_EXIST, INVALID_LOGIN_CREDENTIALS, SUCCESS, UNAUTHORIZED
} from '../../helpers/responses/messages';
import {regexEmail} from '../../helpers/validation/regexes';

export const RegisterHandler = async (req, res) => {
	const {username, email, password} = req.body;

	if (!(username && email && password)) {
		return BAD_REQUEST(res);
	}

	if (username.length < config.get<Object>("USERNAME_LENGTH").min || username.length > config.get<Object>("USERNAME_LENGTH").max) {
		return CUSTOM_RESPONSE(
			res,
			`Username length must be between ${config.get<Object>("USERNAME_LENGTH").min} and ${config.get<Object>("USERNAME_LENGTH").max} characters`,
			400
		);
	}

	if (password.length < config.get<Object>("PASSWORD_LENGTH").min || password.length > config.get<Object>("PASSWORD_LENGTH").max) {
		return CUSTOM_RESPONSE(
			res,
			`Password length must be between ${config.get<Object>("PASSWORD_LENGTH").min} and ${config.get<Object>("PASSWORD_LENGTH").max} characters`,
			400
		);
	}

	if (!regexEmail.test(email)) { // check email format
		return CUSTOM_RESPONSE(
			res,
			'Provide correct email address',
			400
		);
	}

	if (await usernameExists(username)) { // check if user with given username already exists
		return INPUT_USERNAME_EXIST(res);
	}

	if (await emailExists(email)) { // check if user with given username already exists
		return INPUT_EMAIL_EXIST(res);
	}

	if (await createUser({username, email, password})) {
		return ACCOUNT_CREATED(res);
	}

	return CUSTOM_RESPONSE(res, 'Something went wrong! Account has not been created', 400);
};

export const ActivateAccountHandler = async (req, res) => {
	const token = await getActivationTokenRecord(req.params.token);
	if (token === null) {
		return CUSTOM_RESPONSE(res, 'Account activation token is not valid', 400);
	}

	if (await activateAccount(token.userId)) {
		return ACCOUNT_ACTIVATED(res);
	}

	return CUSTOM_RESPONSE(res, 'Something went wrong! Account has not been activated', 400);
};

export const LoginHandler = async (req, res) => {
	await deleteExpiredRefreshTokens();

	const {username, password} = req.body;

	if (!(username && password)) {
		return BAD_REQUEST(res);
	}

	const user = await getUserByUsernameOrEmail(username);

	// user not found in DB
	if (user === null) {
		return INVALID_LOGIN_CREDENTIALS(res);
	}

	if (!await isPassCorrect(password, user.password)) {
		return INVALID_LOGIN_CREDENTIALS(res);
	}

	if (!user.accountActivated) {
		return ACCOUNT_NOT_ACTIVATED(res);
	}

	if (user.banned) {
		return ACCOUNT_BANNED(res);
	}

	const refreshToken = await generateRefreshToken(user.id);
	res.cookie(COOKIE_TYPE.REFRESH_TOKEN, refreshToken, {
		httpOnly: true,
		maxAge: config.get<number>('MAX_AGE_TOKEN_COOKIE'),
		sameSite: 'strict'
	});

	const accessToken = generateAccessToken(user.id);

	return CUSTOM_RESPONSE(res, 'User logged successfully', 200, {token: accessToken});
};

export const RefreshTokenHandler = async (req, res) => {
	const refreshToken = req.cookies[COOKIE_TYPE.REFRESH_TOKEN];
	if (refreshToken == null) {
		return UNAUTHORIZED(res);
	}

	const payload: any = verifyRefreshToken(refreshToken);
	if (payload == null) {
		return UNAUTHORIZED(res);
	}

	const dbToken = await getRefreshToken(payload.id);
	if (dbToken == null) {
		return UNAUTHORIZED(res);
	}

	const newAccessToken = generateAccessToken(payload.id);

	return CUSTOM_RESPONSE(res, 'Access token has been refreshed', 200, {token: newAccessToken});
};

export const LogoutHandler = async (req, res) => {
	const refreshToken = req.cookies[COOKIE_TYPE.REFRESH_TOKEN];

	await deleteRefreshToken(refreshToken); // delete refresh token from DB
	res.cookie(COOKIE_TYPE.REFRESH_TOKEN, '', { maxAge:0 }); // delete http-only cookie refresh token

	return CUSTOM_RESPONSE(res, 'Logged out successfully', 200);
};

export const GetUserHandler = async (_, res) => {
	return CUSTOM_RESPONSE(res, 'success', 200, {user:res.locals.user});
};
