import nodemailer from 'nodemailer';

export const sendMail = async (from: string, to: string, subject: string, text: string, html: string) => {
   const transporter = nodemailer.createTransport({
      host: process.env.OVH_SMTP_ENDPOINT,
      port: 465,
      secure: true,
      auth: {
         user: process.env.OVH_SMTP_USER,
         pass: process.env.OVH_SMTP_PASS
      },
   });

   await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
   });
}