import nodemailer from 'nodemailer';
import striptags from 'striptags';

export default class Mailer {
	private transporter: any;

	/**
	 * Creates mail sender object.
	 */
	constructor() {
		try {
			this.transporter = nodemailer.createTransport({
				host: process.env.SMTP_ENDPOINT,
				port: 465,
				secure: true,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS
				}
			});
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Sends email.
	 *
	 * @param from {string} Mail sender. e.g. `John Doe <noreply@example.com>`
	 * @param to {string} Mail receiver.
	 * @param subject {string} Mail subject.
	 * @param html {string} Mail structure.
	 * @param attachments {list[object]} File attachments.
	 * @returns {boolean} Boolean indicating success.
	 */
	async send(from: string, to: string, subject: string, html: string, attachments: {}[] = []) {
		try {
			await this.transporter.sendMail({
				from,
				to,
				subject,
				text: striptags(html),
				html,
				attachments
			});
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}
}
