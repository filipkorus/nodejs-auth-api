import {PrismaClient} from '@prisma/client';
import {compare, hash} from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import ROLE from '../utils/roles.util';
import Mailer from '../utils/mailer.util';
import {sign, verify} from 'jsonwebtoken';
import fs from 'fs';
import CONFIG from '../config';

const prisma = new PrismaClient();

/**
 * Checks if username already exists.
 *
 * @returns {boolean} which indicates if username is already used.
 * @param username {string} Username to be checked.
 */
export const usernameExists = async (username: string): Promise<boolean> => {
	try {
		return (await prisma.user.count({where:{username}})) > 0;
	} catch (e) {
		return true;
	}
}

/**
 * Checks if email already exists.
 *
 * @returns {boolean} which indicates if email is already used.
 * @param email {string} Email to be checked.
 */
export const emailExists = async (email: string): Promise<boolean> => {
	try {
		return (await prisma.user.count({where:{email}})) > 0;
	} catch (e) {
		return true;
	}
}

/**
 * Save user record in the database, generates email confirmation token and sends activation email.
 *
 * @returns `null` if error occurred.
 * @param userObject Object with username, email and password to be saved.
 */
export const createUser = async ({username, email, password}) => {
	let user = null;
	try {
		user = await prisma.user.create({
			data: {
				username,
				email,
				password: await hash(password, 12),
				role: ROLE.USER
			}
		});
		if (user == null) return null;
	} catch (e) {
		return null;
	}

	// generate email confirmation token and save it to DB
	const emailConfirmationToken = uuidv4();
	try {
		await prisma.activationToken.create({
			data: {
				token: emailConfirmationToken,
				userId: user.id
			}
		});
	} catch (e) {
		return null;
	}

	/* read activation mail template */
	let html = null;
	try {
		html = fs.readFileSync(CONFIG.activationEmailTemplatePath, 'utf-8');
	} catch (e) {}

	const activationUrl = `${process.env.FRONTEND_ACCOUNT_ACTIVATION_PAGE_URL}?token=${emailConfirmationToken}`;

	/* send activation email */
	const mailer = new Mailer();
	await mailer.send(
		process.env.EMAIL_SENDER,
		email,
		'Account activation',
		html == null ? `<p>click <a target="blank" href="${activationUrl}">link</a> to activate your account</p>` : html.replace('{{username}}', username).replace('{{activationUrl}}', activationUrl)
	);

	return true;
};

/**
 * Finds account activation token from the database.
 *
 * @returns {object|null} Activation token record or null if error.
 * @param token {string} Activation token.
 */
export const getActivationTokenRecord = async (token: string) => {
	try {
		return await prisma.activationToken.findFirst({where:{token}});
	} catch (e) {
		return null;
	}
}

/**
 * Activates account (sets `account_activated` field in the database to true) and deletes activation token from the database.
 *
 * @returns {boolean|null} true if success else if error null.
 * @param userId {number} User's ID.
 */
export const activateAccount = async (userId: number) => {
	try {
		await prisma.user.update({
			where: {id: userId},
			data: {accountActivated: true}
		});
	} catch (e) {
		return null;
	}

	// delete token
	try {
		await prisma.activationToken.delete({where:{userId}});
		return true;
	} catch (e) {
		return null;
	}
};

/**
 * Returns user object by given username/email.
 *
 * @returns {object|null} User object or null if error.
 * @param username {string} Username or email of user to be found.
 */
export const getUserByUsernameOrEmail = async (username: string) => {
	try {
		return await prisma.user.findFirst({
			where: {
				OR: [
					{username},
					{email: username},
				]
			}
		});
	} catch (e) {
		return null;
	}
};

/**
 * Checks if password is correct.
 *
 * @returns {boolean} Boolean which indicates password correctness.
 * @param password {string} Password to be checked.
 * @param dbPassword {string} Password saved in the database.
 */
export const isPassCorrect = async (password: string, dbPassword: string) => {
	return await compare(password, dbPassword);
};

/**
 * Generated JWT refresh token, saves it to the database and returns it.
 *
 * @returns {string} JWT refresh token.
 * @param userId {number} User's ID.
 */
export const generateRefreshToken = async (userId: number) => {
	const refreshToken = sign({
			id: userId
		},
		`${process.env.REFRESH_TOKEN_SECRET}`,
		{expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN}
	);

	// save refresh token to DB
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7); // add 7 days to current time
	try {
		await prisma.authToken.create({
			data: {
				userId: userId,
				token: refreshToken,
				expiresAt
			}
		});
	} catch (e) {}

	return refreshToken;
};

/**
 * Returns refresh token object from the database.
 *
 * @returns {object|null} Refresh token record or null if error.
 * @param userId {number} User's ID.
 */
export const getRefreshToken = async (userId: number) => {
	try {
		return await prisma.authToken.findFirst({
			where: {
				userId,
				expiresAt: {gte: new Date()}
			}
		});
	} catch (e) {
		return null;
	}
};

/**
 * Deletes refresh token from the database.
 *
 * @param refreshToken {string} JWT refresh token.
 */
export const deleteRefreshToken = async (refreshToken: string) => {
	try {
		await prisma.authToken.delete({where:{token:refreshToken}});
	} catch (e) {}
}

/**
 * Deletes all expired refresh tokens from the database.
 */
export const deleteExpiredRefreshTokens = async () => {
	try {
		await prisma.authToken.deleteMany({
			where:{expiresAt:{lt:new Date()}}
		});
	} catch (e) {}
};

/**
 * Verifies JWT refresh token.
 *
 * @returns {string | JwtPayload | null} JWT payload.
 * @param refreshToken {string} JWT refresh token.
 */
export const verifyRefreshToken = (refreshToken: string) => {
	try {
		return verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);
	} catch (e) {
		return null;
	}
};

/**
 * Generated JWT access token.
 *
 * @returns {string} JWT access token.
 * @param userId {number} User's ID.
 */
export const generateAccessToken = (userId: number) => {
	return sign(
		{id: userId},
		`${process.env.ACCESS_TOKEN_SECRET}`,
		{expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
	);
};

/**
 * Verifies JWT access token.
 *
 * @returns {string | JwtPayload | null} JWT payload.
 * @param accessToken {string} JWT access token.
 */
export const verifyAccessToken = (accessToken: string) => {
	try {
		return verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`);
	} catch (e) {
		return null;
	}
};

/**
 * Returns user object with given user ID.
 *
 * @returns {object|null} User object or null if error.
 * @param userId {number} User's ID.
 */
export const getUserById = async (userId: number) => {
	try {
		return await prisma.user.findFirst({where:{id:userId}});
	} catch (e) {
		return null;
	}
};
