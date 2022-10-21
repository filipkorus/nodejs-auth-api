import {emailExists, getUserById, isPassCorrect, usernameExists} from '../services/auth.service';
import {deleteAccount, updateEmail, updatePass, updateUsername} from '../services/userSettings.service';
import CONFIG from '../config';

export const ChangeUsername = async (req, res) => {
	const {newUsername, password} = req.body;

	if (!(newUsername && password)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid credentials'
		});
	}

	if (newUsername.length < CONFIG.usernameLength.min || newUsername.length > CONFIG.usernameLength.max) {
		return res.status(400).json({
			success: false,
			message: `Username length must be between ${CONFIG.usernameLength.min} and ${CONFIG.usernameLength.max} characters`
		});
	}

	if (await usernameExists(newUsername)) {
		return res.status(400).json({
			success: false,
			message: 'Given username is already used'
		});
	}

	const user = await getUserById((req as any).user.id)

	if (!(await isPassCorrect(password, user.password))) {
		return res.status(200).json({
			success: false,
			message: 'Invalid password'
		});
	}

	if (await updateUsername(newUsername, (req as any).user.id)) {
		return res.status(200).json({
			success: true,
			message: 'Username has been updated'
		});
	}

	return res.status(400).json({
		success: false,
		message: 'Something went wrong! Username not updated'
	});
};

export const ChangeEmail = async (req, res) => {
	const {newEmail, password} = req.body;

	if (!(newEmail && password)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid credentials'
		});
	}

	if (!/\S+@\S+\.\S+/.test(newEmail)) {
		return res.status(400).json({
			success: false,
			message: 'Provide correct email address'
		});
	}

	if (await emailExists(newEmail)) {
		return res.status(400).json({
			success: false,
			message: 'Given email is already used'
		});
	}

	const user = await getUserById((req as any).user.id)

	if (!(await isPassCorrect(password, user.password))) {
		return res.status(200).json({
			success: false,
			message: 'Invalid password'
		});
	}

	/* TODO: implement email confirmation */

	if (await updateEmail(newEmail, (req as any).user.id)) {
		return res.status(200).json({
			success: true,
			message: 'Email has been updated'
		});
	}

	return res.status(400).json({
		success: false,
		message: 'Something went wrong! Email not updated'
	});
};

export const ChangePassword = async (req, res) => {
	const {newPassword, password} = req.body;

	if (!(newPassword && password)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid credentials'
		});
	}

	if (newPassword.length < CONFIG.passwordLength.min || newPassword.length > CONFIG.passwordLength.max) {
		return res.status(400).json({
			success: false,
			message: `Password length must be between ${CONFIG.passwordLength.min} and ${CONFIG.passwordLength.max} characters`
		});
	}

	const user = await getUserById((req as any).user.id)

	if (!(await isPassCorrect(password, user.password))) {
		return res.status(200).json({
			success: false,
			message: 'Invalid password'
		});
	}

	if (await updatePass(newPassword, (req as any).user.id)) {
		return res.status(200).json({
			success: true,
			message: 'Password has been updated'
		});
	}

	return res.status(400).json({
		success: false,
		message: 'Something went wrong! Password not updated'
	});
};

export const DeleteAccount = async (req, res) => {
	const {password} = req.body;

	if (!password) {
		return res.status(400).json({
			success: false,
			message: 'Invalid credentials'
		});
	}

	const user = await getUserById((req as any).user.id);

	if (!(await isPassCorrect(password, user.password))) {
		return res.status(200).json({
			success: false,
			message: 'Invalid password'
		});
	}

	if (await deleteAccount((req as any).user.id)) {
		return res.status(200).json({
			success: true,
			message: 'Account has been deleted'
		});
	}

	return res.status(400).json({
		success: false,
		message: 'Something went wrong!'
	});
};
