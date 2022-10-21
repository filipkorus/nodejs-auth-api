import path from 'path';

const CONFIG = {
	usernameLength: {min:6, max:25}, // in case of changes - modify schema.prisma as well
	passwordLength: {min:8, max:50},
	staticFilesDir: path.resolve(process.env.NODE_ENV === 'production' ? '/app/public/' : '/var/www/nodejs-auth-api/'),
	activationEmailTemplatePath : path.resolve(process.env.NODE_ENV === 'production' ? '/app/data/activation_email_template.html' : '/home/filek7/Desktop/nodejs-auth-api/activation_email_template.html'),
	envFilePath: process.env.NODE_ENV === 'production' ? path.resolve('/app/.env') : path.resolve(__dirname, '/../.env'),
	useRequestLogger: true
};

export default CONFIG;
