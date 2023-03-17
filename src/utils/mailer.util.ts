import nodemailer from 'nodemailer';
import striptags from 'striptags';
import config from 'config';
import {logError} from './logger';
import * as Path from "path";

export default class Mailer {
	private transporter: any;

	/**
	 * Creates mail sender object.
	 */
	constructor() {
		try {
			this.transporter = nodemailer.createTransport({
				host: config.get<string>("SMTP_ENDPOINT"),
				port: 465,
				secure: true,
				auth: {
					user: config.get<string>("SMTP_USERNAME"),
					pass: config.get<string>("SMTP_PASSWORD")
				}
			});
		} catch (e) {
			logError(e);
		}
	}

	/**
	 * Sends email.
	 *
	 * @param email {Email} Email object.
	 * @returns {boolean} Boolean indicating success.
	 */
	async send(email: Email) {
		try {
			await this.transporter.sendMail({
				from: email.from,
				to: email.to,
				subject: email.subject,
				text: striptags(email.html),
				html: email.html,
				attachments: email.attachments || []
			});
			return true;
		} catch (e) {
			logError(e);
			return false;
		}
	}
}

export interface Email {
	from: string;
	to: string;
	subject: string;
	html: string;
	attachments?: {filename: string, path: string}[];
};
