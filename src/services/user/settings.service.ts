import {PrismaClient} from '@prisma/client';
import {hash} from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Updates user's username in the database.
 *
 * @returns {boolean}  which indicates if username was successfully updated.
 * @param newUsername {string} New username to be set.
 * @param userId {number} User's ID.
 */
export const updateUsername = async (newUsername: string, userId: number) => {
	try {
		await prisma.user.update({
			data:{username:newUsername},
			where:{id:userId},
		});
	} catch (e) {
		return false;
	}
	return true;
};

/**
 * Updates user's email in the database.
 *
 * @returns {boolean}  which indicates if email was successfully updated.
 * @param newEmail {string} New email to be set.
 * @param userId {number} User's ID.
 */
export const updateEmail = async (newEmail: string, userId: number) => {
	try {
		await prisma.user.update({
			data:{email:newEmail},
			where:{id:userId},
		});
	} catch (e) {
		return false;
	}
	return true;
};

/**
 * Updates user's password in the database.
 *
 * @returns {boolean} which indicates if password was successfully updated.
 * @param newPassword {string} New password to be set.
 * @param userId {number} User's ID.
 */
export const updatePass = async (newPassword: string, userId: number) => {
	try {
		await prisma.user.update({
			data:{password:await hash(newPassword, 12)},
			where:{id:userId},
		});
	} catch (e) {
		return false;
	}
	return true;
};

/**
 * Deletes user's account as well as other associated data in the database.
 *
 * @returns {boolean} which indicates if account was successfully deleted.
 * @param userId {number} User's ID.
 */
export const deleteAccount = async (userId: number) => {
	// delete all data left in DB
	const deleteTokens = prisma.authToken.deleteMany({where:{userId}});
	const deleteActivationToken = prisma.activationToken.deleteMany({where:{userId}});
	const deleteUser = prisma.user.delete({where:{id:userId}});

	try {
		await prisma.$transaction([deleteTokens, deleteActivationToken, deleteUser]);
	} catch (e) {
		return false;
	}
	return true;
};
