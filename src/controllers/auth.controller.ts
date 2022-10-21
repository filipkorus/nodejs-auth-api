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
} from '../services/auth.service';
import CONFIG from "../config";

export const Register = async (req, res) => {
	const {username, email, password} = req.body;

	if (!(username && email && password)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid credentials'
		});
	}

	if (username.length < CONFIG.usernameLength.min || username.length > CONFIG.usernameLength.max) {
		return res.status(400).json({
			success: false,
			message: `Username length must be between ${CONFIG.usernameLength.min} and ${CONFIG.usernameLength.max} characters`
		});
	}

	if (password.length < CONFIG.passwordLength.min || password.length > CONFIG.passwordLength.max) {
		return res.status(400).json({
			success: false,
			message: `Password length must be between ${CONFIG.passwordLength.min} and ${CONFIG.passwordLength.max} characters`
		});
	}

	if (!/\S+@\S+\.\S+/.test(email)) { // check email format
		return res.status(400).json({
			success: false,
			message: 'Provide correct email address'
		});
	}

	if (await usernameExists(username)) { // check if user with given username already exists
		return res.status(400).json({
			success: false,
			message: 'Given username is already used'
		});
	}

	if (await emailExists(email)) { // check if user with given username already exists
		return res.status(400).json({
			success: false,
			message: 'Given email is already used'
		});
	}

	if (await createUser({username, email, password})) {
		return res.status(201).json({
			success: true,
			message: 'Account has been created! Check your email to confirm'
		});
	}

	return res.status(400).json({
		success: false,
		message: 'Something went wrong! Account has not been created'
	});
};

export const ActivateAccount = async (req, res) => {
	const token = await getActivationTokenRecord(req.params.token);
	if (token === null) {
		return res.status(400).json({
			success: false,
			message: 'Account activation token is not valid'
		});
	}

	if (await activateAccount(token.userId)) {
		return res.json({
			success: true,
			message: 'Your account has been activated'
		});
	}

	return res.status(400).json({
		success: false,
		message: 'Something went wrong! Account has not been activated'
	});
};

export const Login = async (req, res) => {
	await deleteExpiredRefreshTokens();

	const {username, password} = req.body;

	if (!(username && password)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid credentials'
		});
	}

	const user = await getUserByUsernameOrEmail(username);

	// user not found in DB
	if (user === null) {
		return res.status(400).json({
			success: false,
			message: 'Invalid username or password'
		});
	}

	if (!await isPassCorrect(password, user.password)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid username or password'
		});
	}

	if (!user.accountActivated) {
		return res.status(400).json({
			success: false,
			message: 'Activate your account before logging in'
		});
	}

	if (user.banned) {
		return res.status(400).json({
			success: false,
			message: 'Your account has been banned'
		});
	}

	const refreshToken = await generateRefreshToken(user.id);
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
		sameSite: 'strict'
	});

	const accessToken = generateAccessToken(user.id);
	res.json({
		success: true,
		message: 'User logged successfully',
		token: accessToken
	});
};

export const Refresh = async (req, res) => {
	const refreshToken = req.cookies['refreshToken'];
	if (refreshToken == null) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized'
		});
	}

	const payload: any = verifyRefreshToken(refreshToken);
	if (payload == null) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized'
		});
	}

	const dbToken = await getRefreshToken(payload.id);
	if (dbToken == null) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized'
		});
	}

	const newAccessToken = generateAccessToken(payload.id);
	res.json({
		success: true,
		message: 'Access token has been refreshed',
		token: newAccessToken
	});
};

export const Logout = async (req, res) => {
	const refreshToken = req.cookies['refreshToken'];

	await deleteRefreshToken(refreshToken); // delete refresh token from DB
	res.cookie('refreshToken', '', { maxAge:0 }); // delete http-only cookie refresh token

	res.json({
		success: true,
		message: 'Logged out successfully'
	});
};

export const GetUser = async (req, res) => {
	return res.json({
		success: true,
		message: 'success',
		user: (req as any).user
	});
};
