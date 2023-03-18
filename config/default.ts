import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default {
	PORT: process.env.PORT || 3000,
	ORIGIN: process.env.ORIGIN?.split(';') || ['http://localhost:3000'],
	FRONTEND_ACCOUNT_ACTIVATION_PAGE_URL: process.env.FRONTEND_ACCOUNT_ACTIVATION_PAGE_URL,

	STATIC_FILES_DIR: path.resolve(process.env.NODE_ENV === 'production' ?
		'/app/public/' : '/var/www/nodejs-auth-api/'),
	ACTIVATION_EMAIL_TEMPLATE_PATH: path.resolve(process.env.NODE_ENV === 'production' ?
		'/app/data/activation_email_template.html' : '/home/filek7/Desktop/nodejs-auth-api/activation_email_template.html'),

	USE_REQUEST_LOGGER: true,

	USERNAME_LENGTH: {min:6, max:25}, // in case of changes - modify schema.prisma as well
	PASSWORD_LENGTH: {min:8, max:50},

	DB_URL: process.env.DB_URL,

	SMTP_ENDPOINT: process.env.SMTP_ENDPOINT,
	SMTP_USERNAME: process.env.SMTP_USERNAME,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,
	EMAIL_SENDER: process.env.EMAIL_SENDER,

	ACCESS_TOKEN: process.env.ACCESS_TOKEN,
	ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,

	REFRESH_TOKEN: process.env.REFRESH_TOKEN,
	REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,

	MAX_AGE_TOKEN_COOKIE: process.env.MAX_AGE_TOKEN_COOKIE || 7 * 24 * 60 * 60 * 1000 // 7 days
};
