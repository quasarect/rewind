import keyModel from "../models/keySchema";

const nodemailer = require("nodemailer");

/**
 *
 * @param subject Subject of the mail
 * @param text Text to send
 * @param receipient To whom to send
 */
export const send_mail = async (
	userId: string,
	receipient: string,
	type: string,
) => {
	let subject = "subject",
		text = "text";

	const keys = await keyModel.findById(process.env.KEYS_ID);
	const transport = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: process.env.EMAIL_USER,
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			refreshToken: keys?.refreshToken, // Take from data base
			accessToken: keys?.accessToken, // take from data base
		},
	});
	const mail_options = {
		from: process.env.EMAIL_USER,
		to: receipient,
		subject: subject,
		text: text,
	};
	transport.sendMail(mail_options, (err: any, data: any) => {
		if (err) {
			console.log("Send err :" + err);
		} else {
			console.log("Email sent successfully", data);
		}
		transport.close();
	});
};
